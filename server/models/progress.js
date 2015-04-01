'use strict';

var _ = require('lodash');
var services = require('../services');
var Promise = require('bluebird');

function Progress() {}

Progress.prototype.get = function() {
  return services.redisClient.getAsync('progress').then(JSON.parse);
};

/*
 * Return a list of issues filtered by options.
 */
Progress.prototype.query = function(issues, opts) {
  return _.filter(issues, function(issue) {
    if (opts.epic && issue.epic !== opts.epic) return false;
    if (opts.labels && _.difference(opts.labels, issue.labels).length > 0) return false;
    if (opts.sprint && !(_.includes(issue.sprints, opts.sprint))) return false;
    if (opts.type && opts.type !== issue.type) return false;
    return true;
  });
};

/*
 * Calculate percentage completion based on status and estimate.
 */
Progress.prototype.calculate = function(issues) {
  var total = 0;
  var current = 0;

  _.forEach(issues, function(issue) {
    total += issue.estimate;
    if (issue.status === 'Done') current += issue.estimate;
  });
  if (total === 0) return 0;
  return Math.round(current / total * 100);
};

/*
 * Look through all issues for the given sprint, and return a list of epics which are included in that sprint.
 */
Progress.prototype.epicsInSprint = function(issues, sprint) {
  var epics = [];
  var activeEpicIds = [];
  _.forEach(issues, function(issue) {
    if (issue.type === 'Epic') {
      epics.push({id: issue.id, title: issue.summary});
      return;
    }

    if (issue.type !== 'Story') return;
    if (!(_.includes(issue.sprints, sprint))) return;

    activeEpicIds.push(issue.epic);
  });

  return _.filter(epics, function(epic) {
    return _.includes(activeEpicIds, epic.id);
  });
};

/*
 * Do a complete recalculation of all progress values needed for the site.
 *
 * Because Jira has 3 ways of doing everything, epics are also considered issues (both can have estimates).
 *
 */
Progress.prototype.writeAll = function(sprint) {
  var that = this;
  var filters = [
    {type: 'Story', labels: ['art']},
    {type: 'Story', labels: ['design']},
    {type: 'Story', labels: ['dev']},
    {type: 'Bug'}
  ];

  return this.getAllIssues().then(function(issues) {
    that.issues = issues;
    that.epics = that.epicsInSprint(issues, sprint.id);

    _.forEach(that.epics, function(epic) {
      filters.push({type: 'Story', epic: epic.id});
    });

    var results = _.map(filters, function(filter) {
      return that.calculate(that.query(that.issues, filter));
    });
    var totals = {
      total: {
        art: results[0],
        design: results[1],
        code: results[2],
        bugs: results[3]
      }
    };
    totals.epics = _.map(that.epics, function(epic, index) {
      return {title: epic.title, progress: results[index + 4]};
    });
    return services.redisClient.setAsync('progress', JSON.stringify(totals));
  });
};

Progress.prototype.getAllIssues = Promise.coroutine(function *() {
  var issueIds = [];
  var cursor = '0';
  do {
    var result = yield services.redisClient.scanAsync([cursor, 'MATCH', 'issue*']);
    cursor = result[0];
    issueIds = issueIds.concat(result[1]);
  } while (cursor !== '0');
  return Promise.map(issueIds, function(id) {
    return services.redisClient.getAsync(id).then(JSON.parse);
  }, {concurrency: 10});
});

module.exports = Progress;