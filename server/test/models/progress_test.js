'use strict';

var Promise = require('bluebird');
Promise.longStackTraces();
var chai = require('chai');
var dirtyChai = require('dirty-chai');
chai.use(dirtyChai);
var expect = chai.expect;
require('co-mocha');
var Progress = require('../../models/progress');
var services = require('../../services');
var redis = Promise.promisifyAll(require('redis'));

describe('Jira', function() {
  var that = this;

  describe('no issues', function() {
    beforeEach(function() {
      that.issues = [];
    });

    it('shows 0% progress', function *() {
      var progress = new Progress();
      var result = yield progress.calculate(that.issues);
      expect(result).to.equal(0);
    });
  });

  describe('filter by label', function() {
    beforeEach(function() {
      that.issues = [
        {
          id: '45',
          estimate: 3,
          status: 'Done',
          labels: ['Art']
        },
        {
          id: '756',
          estimate: 1,
          status: 'To Do',
          labels: ['Art', 'Design']
        },
        {
          id: '421',
          estimate: 3,
          status: 'Done',
          labels: ['Design']
        }
      ];
    });

    it('returns the correct progress', function *() {
      var progress = new Progress();
      var result = yield progress.calculate(that.issues, {labels: ['Art']});
      expect(result).to.equal(75);
    });
  });

  describe('filter by sprint', function() {
    beforeEach(function() {
      that.issues = [
        {
          id: '45',
          estimate: 1,
          status: 'Done',
          sprints: [1]
        },
        {
          id: '756',
          estimate: 1,
          status: 'To Do',
          sprints: [1]
        },
        {
          id: '421',
          estimate: 3,
          status: 'Done',
          sprints: [2]
        }
      ];
    });

    it('returns the correct progress', function *() {
      var progress = new Progress();
      var result = yield progress.calculate(that.issues, {sprint: 1});
      expect(result).to.equal(50);
    });
  });

  describe('filter by type', function() {
    beforeEach(function() {
      that.issues = [
        {
          id: '45',
          estimate: 2,
          status: 'Done',
          type: 'Bug'
        },
        {
          id: '756',
          estimate: 3,
          status: 'To Do',
          type: 'Bug'
        },
        {
          id: '421',
          estimate: 3,
          status: 'Done',
          type: 'Story'
        }
      ];
    });

    it('returns the correct progress', function *() {
      var progress = new Progress();
      var result = yield progress.calculate(that.issues, {type: 'Bug'});
      expect(result).to.equal(40);
    });
  });

  describe('writeAll', function() {
    beforeEach(function *() {
      services.redisClient = redis.createClient();
      yield services.redisClient.selectAsync(15);
      yield services.redisClient.flushdbAsync();
      yield services.redisClient.setAsync('issue45', JSON.stringify({
        id: '45',
        estimate: 2,
        labels: ['Art'],
        sprints: [1],
        status: 'Done',
        type: 'Bug'
      }));
      yield services.redisClient.setAsync('issue756', JSON.stringify({
        id: '756',
        estimate: 3,
        labels: ['Art'],
        status: 'To Do',
        type: 'Bug'
      }));
      yield services.redisClient.setAsync('issue421', JSON.stringify({
        id: '421',
        estimate: 3,
        labels: [],
        status: 'Done',
        type: 'Story'
      }));
      yield services.redisClient.setAsync('issue421', JSON.stringify({
        id: '421',
        estimate: 3,
        labels: ['Art', 'Design'],
        sprints: [1],
        status: 'Done',
        type: 'Story'
      }));
      yield services.redisClient.setAsync('unrelated', 'snoogans');
    });

    afterEach(function *() {
      services.redisClient.quit();
    });

    it('calculates progress', function *() {
      var progress = new Progress();
      progress.writeAll();
      // TODO this needs expectations, should probably split into multiple tests
    });
  });
});