'use strict';

var Jira = require('../models/jira');
var Progress = require('../models/progress');
var parse = require('co-body');

module.exports = {
  create: function *() {
    var body = yield parse.json(this);
    this.body = {};

    var jira = new Jira();
    if (body.webhookEvent === 'jira:issue_created') {
      yield jira.create(body.issue);
    } else if (body.webhookEvent === 'jira:issue_updated') {
      yield jira.update(body.issue);
    } else if (body.webhookEvent === 'jira:issue_deleted') {
      yield jira.delete(body.issue);
    } else {
      return;
    }
    var progress = new Progress();
    var sprint = yield jira.getCurrentSprint();
    yield progress.writeAll(sprint);
  }
};