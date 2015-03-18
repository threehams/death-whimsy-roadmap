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

describe('GET /', function() {
  before(function() {
    request = request.agent(app.listen());
  });

  it('returns index.html', function *() {
    var response = yield request.get('/').expect(200).end();
    expect(response.text).to.match(/Death Whimsy/);
  });
});