'use strict';

var _ = require('lodash');
var services = require('../services');
var Promise = require('bluebird');

function Progress() {}

Progress.prototype.get = function() {
  return services.redisClient.getAsync('progress').then(JSON.parse);
};

Progress.prototype.calculate = function(issues, opts) {
  if (!issues.length) return Promise.resolve(0);

  opts = opts || {};
  var total = 0;
  var current = 0;

  _(issues).filter(function(issue) {
    if (opts.epic && issue.epic !== opts.epic) return false;
    if (opts.labels && _.difference(opts.labels, issue.labels).length > 0) return false;
    if (opts.sprint && !(_.includes(issue.sprints, opts.sprint))) return false;
    if (opts.type && opts.type !== issue.type) return false;
    return true;
  }).forEach(function(issue) {
    total += issue.estimate;
    if (issue.status === 'Done') current += issue.estimate;
  }).value();
  if (total === 0) return Promise.resolve(0);
  return Promise.resolve(Math.round(current / total * 100));
};

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

Progress.prototype.writeAll = function(sprint) {
  var filters = [
    {type: 'Story', labels: ['art']},
    {type: 'Story', labels: ['design']},
    {type: 'Story', labels: ['dev']},
    {type: 'Bug'}
  ];

  return this.getAllIssues().bind(this).then(function(issues) {
    this.issues = issues;

    this.epics = this.epicsInSprint(issues, sprint.id);
    _.forEach(this.epics, function(epic) {
      filters.push({type: 'Story', epic: epic.id});
    });

    return filters;
  }).map(function(filter) {
    return this.calculate(this.issues, filter);
  }).then(function(num) {
    var totals = {
      total: {
        art: num[0],
        design: num[1],
        code: num[2],
        bugs: num[3]
      }
    };
    totals.epics = _.map(this.epics, function(epic, index) {
      return {title: epic.title, progress: num[index + 4]};
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