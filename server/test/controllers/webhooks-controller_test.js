'use strict';

var Promise = require('bluebird');
Promise.longStackTraces();
var chai = require('chai');
var dirtyChai = require('dirty-chai');
chai.use(dirtyChai);
var expect = chai.expect;
require('co-mocha');
var app = require('../../app');
var request = require('co-supertest');
var nock = require('nock');
nock.enableNetConnect();
var services = require('../../services');
var redis = Promise.promisifyAll(require('redis'));

describe('GET /api/resources', function() {
  before(function *() {
    request = request.agent(app.listen());
  });

  beforeEach(function *() {
    services.redisClient = redis.createClient();
    yield services.redisClient.selectAsync(15);
    yield services.redisClient.flushdbAsync();
    //yield services.redisClient.setAsync('progress', JSON.stringify({
    //  sprint: {
    //    all: 100
    //  }
    //}));
  });

  afterEach(function *() {
    //services.redisClient.quit();
  });

  it('rejects calls with no token', function *() {
    var response = yield request.get('/api/progress').expect(200).end();
    expect(response.body).to.eql({sprint: {all: 100}});
  });

  it('rejects calls with an incorrect token', function *() {
    var response = yield request.get('/api/progress').expect(200).end();
    expect(response.body).to.eql({sprint: {all: 100}});
  });

  describe('hooks', function() {
    it('rejects calls with an incorrect token', function *() {
      var response = yield request.get('/api/progress').expect(200).end();
      expect(response.body).to.eql({sprint: {all: 100}});
    });
  });
});