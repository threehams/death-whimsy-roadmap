'use strict';

var Promise = require('bluebird');
var Jira = require('../models/jira');
var Progress = require('../models/progress');
var services = require('../services');
var url = require('url');
var redis = Promise.promisifyAll(require('redis'));
var redisURL = url.parse(process.env.REDISCLOUD_URL || 'redis://user:pass@localhost:6379');
var _ = require('lodash');
var jira = new Jira();
var progress = new Progress();

var run = Promise.coroutine(function *() {
  yield jira.writeAll();
  var sprint = yield jira.getCurrentSprint();
  console.log(JSON.stringify(sprint));
  yield progress.writeAll(sprint);
});

services.redisClient = redis.createClient(redisURL.port, redisURL.hostname, {no_ready_check: true});
services.redisClient.authAsync(redisURL.auth.split(':')[1]).then(function() {
  return run();
}).then(function() {
  process.exit(0);
});