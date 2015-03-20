'use strict';

var Promise = require('bluebird');
var _ = require('lodash');
var requestAsync = Promise.promisify(require('request'));
var services = require('../services');
var moment = require('moment');

function Jira() { }

Jira.prototype.create = function(issue) {
  return services.redisClient.setAsync('issue' + issue.id, JSON.stringify(this.formatIssue(issue)));
};

Jira.prototype.update = function(issue) {
  return services.redisClient.setAsync('issue' + issue.id, JSON.stringify(this.formatIssue(issue)));
};

Jira.prototype.delete = function(issue) {
  return services.redisClient.delAsync('issue' + issue.id);
};

Jira.prototype.query = function(opts) {
  var queryStrings = _.merge({maxResults: 1000}, opts || {});
  return requestAsync({
    url: 'https://squidtankgames.atlassian.net/rest/api/2/search',
    qs: queryStrings,
    auth: {
      user: process.env.JIRA_USERNAME || require('../../.env.json').jira.username,
      password: process.env.JIRA_PASSWORD || require('../../.env.json').jira.password
    },
    json: true
  }).bind(this).spread(function(response, body) {
    return _.map(body.issues, this.formatIssue);
  });
};

Jira.prototype.formatIssue = function(issue) {
  function getSprintIds(sprints) {
    return _.map(sprints, function(sprintString) {
      var pairs = sprintString.match(/\[(.+)\]/)[1].split(',');
      return _.reduce(pairs, function(result, pair) {
        if (pair.split('=')[0] === 'id') return parseInt(pair.split('=')[1]);
      });
    });
  }

  return {
    id: issue.id,
    type: issue.fields.issuetype.name,
    status: issue.fields.status.name,
    summary: issue.fields.summary,
    labels: _.map(issue.fields.labels, function(label) { return label.toLowerCase(); }),
    description: issue.fields.description,
    estimate: issue.fields.customfield_10005 ? Math.floor(issue.fields.customfield_10005) : 1,
    sprints: getSprintIds(issue.fields.customfield_10007)
  };
};

/*
 * Get sprint details from undocumented Jira Agile API.
 *
 * This requests a full list of issues for the sprint, and throws away everything except the sprint details.
 * It may be possible to find a better route to hit, with a lot of searching.
 *
 */
Jira.prototype.getCurrentSprint = function() {
  return requestAsync({
    url: 'https://squidtankgames.atlassian.net/rest/greenhopper/1.0/sprintquery/1', // TODO rapidview id 1 hardcoded
    auth: {
      user: process.env.JIRA_USERNAME || require('../../.env.json').jira.username,
      password: process.env.JIRA_PASSWORD || require('../../.env.json').jira.password
    },
    json: true
  }).bind(this).spread(function(response, body) {
    var sprintId = _.find(body.sprints, {state: 'ACTIVE'}).id;
    return requestAsync({
      url: 'https://squidtankgames.atlassian.net/rest/greenhopper/1.0/rapid/charts/sprintreport?rapidViewId=1&sprintId=' + sprintId,
      auth: {
        user: process.env.JIRA_USERNAME || require('../../.env.json').jira.username,
        password: process.env.JIRA_PASSWORD || require('../../.env.json').jira.password
      },
      json: true
    });
  }).spread(function(response, body) {
    var sprint = body.sprint;
    return {
      id: sprint.id,
      name: sprint.name,
      startDate: moment(sprint.startDate, 'D/MMM/YY H:mm a').toDate(), // 18/Mar/15 1:51 PM
      endDate: moment(sprint.endDate, 'D/MMM/YY H:mm a').toDate()
    };
  });
};

Jira.prototype.writeAll = function() {
  return this.query().then(function(issues) {
    return Promise.map(issues, function(issue) {
      return services.redisClient.setAsync('issue' + issue.id, JSON.stringify(issue));
    });
  });
};

module.exports = Jira;