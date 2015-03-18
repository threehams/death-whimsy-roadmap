'use strict';

var Webhook = require('../models/webhook');
var parse = require('co-body');

module.exports = {
  index: function *() {
    var resource = new Webhook();
    this.body = yield resource.all();
  },
  create: function *() {
    var body = yield parse.json(this);
    console.log(body);
    this.body = {};
  }
};