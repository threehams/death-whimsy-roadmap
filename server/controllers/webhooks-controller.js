'use strict';
var Jira = require('../models/jira');
var Progress = require('../models/progress');
var parse = require('co-body');

module.exports = {
  create: function *() {
    if (!this.query.token || !process.env.WEBHOOK_TOKEN || (this.query.token !== process.env.WEBHOOK_TOKEN)) {
      this.status = 401;
      return;
    }

    var body = yield parse.json(this);

    var jira = new Jira();
    if (body.webhookEvent === 'jira:issue_created') {
      yield jira.create(body.issue);
    } else if (body.webhookEvent === 'jira:issue_updated') {
      yield jira.update(body.issue);
    } else if (body.webhookEvent === 'jira:issue_deleted') {
      yield jira.delete(body.issue);
    } else {
      this.body = {};
      return;
    }
    var progress = new Progress();
    var sprint = yield jira.getCurrentSprint();
    yield progress.writeAll(sprint);
    this.body = {};
  }
};