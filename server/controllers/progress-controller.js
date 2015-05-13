'use strict';

var Jira = require('../models/jira');
var Progress = require('../models/progress');

module.exports = {
  // TODO in-memory cache would be great here! this is tiny!
  index: function *() {
    var progress = new Progress();
    this.body = yield progress.get();
  }
};
