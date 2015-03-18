'use strict';

var Promise = require('bluebird');
var app = require('./app');
var services = require('./services');
var redis = Promise.promisifyAll(require('redis'));
var url = require('url');
var redisURL = url.parse(process.env.REDISCLOUD_URL || 'redis://user:pass@localhost:6379');
services.redisClient = redis.createClient(redisURL.port, redisURL.hostname, {no_ready_check: true});
services.redisClient.authAsync(redisURL.auth.split(':')[1]).then(function() {
  app.listen(process.env.PORT || 8888);
});