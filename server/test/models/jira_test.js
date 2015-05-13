'use strict';

var Promise = require('bluebird');
Promise.longStackTraces();
var chai = require('chai');
var dirtyChai = require('dirty-chai');
chai.use(dirtyChai);
var expect = chai.expect;
require('co-mocha');
var Jira = require('../../models/jira');
var nock = require('nock');
nock.enableNetConnect();
var services = require('../../services');
var redis = Promise.promisifyAll(require('redis'));
var moment = require('moment');

describe('Jira', function() {
  describe('query', function() {
    beforeEach(function() {
      nock('https://squidtankgames.atlassian.net')
        .get('/rest/api/2/search?maxResults=1000')
        .replyWithFile(200, __dirname + '/../fixtures/jira-all.json');
    });

    it('returns a list of formatted issues', function *() {
      var jira = new Jira();
      var issues = yield jira.query();
      issues = issues.filter(function(issue) {
        return issue.type !== 'Epic';
      });
      expect(issues[0].id).to.equal('10153');
      expect(issues[0].summary).to.equal('Test for webhook / sprint');
      expect(issues[0].description).to.equal('this is a test - ignore');
      expect(issues[0].type).to.equal('Story');
      expect(issues[0].status).to.equal('To Do');
      expect(issues[0].estimate).to.equal(1);
      expect(issues[0].labels).to.eql(['promotion']);
      expect(issues[0].sprints).to.eql([1]);
      expect(issues[0].epic).to.eql('10120');

      expect(issues[1].estimate).to.equal(3);
    });
  });

  describe('getCurrentSprint', function() {
    beforeEach(function() {
      nock('https://squidtankgames.atlassian.net')
        .get('/rest/greenhopper/1.0/sprintquery/1')
        .replyWithFile(200, __dirname + '/../fixtures/jira-sprints.json');
      nock('https://squidtankgames.atlassian.net')
        .get('/rest/greenhopper/1.0/rapid/charts/sprintreport?rapidViewId=1&sprintId=1')
        .replyWithFile(200, __dirname + '/../fixtures/jira-sprint-details.json');
    });

    it('returns the latest sprint', function *() {
      var jira = new Jira();
      var sprint = yield jira.getCurrentSprint();
      expect(sprint.id).to.equal(1);
      expect(sprint.name).to.equal('Sprint 4');
      expect(sprint.startDate).to.eql(moment('2015-03-18T20:51:00.000Z').toDate());
      expect(sprint.endDate).to.eql(moment('2015-03-30T20:51:00.000Z').toDate());
    });
  });

  describe('writeAll', function() {
    beforeEach(function *() {
      services.redisClient = redis.createClient();
      yield services.redisClient.selectAsync(15);
      yield services.redisClient.flushdbAsync();
      nock('https://squidtankgames.atlassian.net')
        .get('/rest/api/2/search?maxResults=1000')
        .replyWithFile(200, __dirname + '/../fixtures/jira-all.json');
    });

    afterEach(function *() {
      services.redisClient.quit();
    });

    it('writes all issues to Redis', function *() {
      var jira = new Jira();
      yield jira.writeAll();
      var record = JSON.parse(yield services.redisClient.getAsync('issue10153'));
      expect(record.summary).to.equal('Test for webhook / sprint');
      record = JSON.parse(yield services.redisClient.getAsync('issue10151'));
      expect(record.summary).to.equal('Dynamically generate the art graphic.');
    });
  });
});