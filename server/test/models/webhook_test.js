'use strict';

var Promise = require('bluebird');
Promise.longStackTraces();
var chai = require('chai');
var dirtyChai = require('dirty-chai');
chai.use(dirtyChai);
var expect = chai.expect;
require('co-mocha');
var Webhook = require('../../models/webhook');

describe('Webhook', function() {
  xdescribe('ticket creation', function() {

  });

  xdescribe('ticket update', function() {

  });

  xdescribe('ticket delete', function() {

  });
});