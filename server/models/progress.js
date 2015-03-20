'use strict';

var _ = require('lodash');
var services = require('../services');
var Promise = require('bluebird');

function Progress() {}

Progress.prototype.get = function() {
  return services.redisClient.getAsync('progress').then(JSON.parse);
  //return {
  //  sprint: {
  //    all: 100,
  //    code: 70,
  //    art: 50,
  //    design: 50,
  //    bugs: 50
  //  }
  //};
};

Progress.prototype.calculate = function(issues, opts) {
  if (!issues.length) return Promise.resolve(0);

  opts = opts || {};
  var total = 0;
  var current = 0;

  _(issues).filter(function(issue) {
    if (opts.labels && _.difference(opts.labels, issue.labels).length > 0) {
      return false;
    }
    if (opts.sprint && !(_.includes(issue.sprints, opts.sprint))) {
      return false;
    }
    if (opts.type && opts.type !== issue.type) return false;
    return true;
  }).forEach(function(issue) {
    total += issue.estimate;
    if (issue.status === 'Done') current += issue.estimate;
  }).value();
  if (total === 0) return Promise.resolve(0);
  return Promise.resolve(Math.round(current / total * 100));
};

Progress.prototype.writeAll = function(sprint) {
  var filters = [
    {sprint: sprint.id},
    {sprint: sprint.id, type: 'Story', labels: ['art']},
    {sprint: sprint.id, type: 'Story', labels: ['design']},
    {sprint: sprint.id, type: 'Story', labels: ['dev']},
    {sprint: sprint.id, type: 'Bug'},
    {},
    {type: 'Story', labels: ['art']},
    {type: 'Story', labels: ['design']},
    {type: 'Story', labels: ['dev']},
    {type: 'Bug'}
  ];

  return this.getAllIssues().bind(this).then(function(issues) {
    this.issues = issues;
    return filters;
  }).map(function(filter) {
    return this.calculate(this.issues, filter);
  }).then(function(num) {
    return services.redisClient.setAsync('progress', JSON.stringify({
      progress: {
        sprint: {
          all: num[0],
          art: num[1],
          design: num[2],
          code: num[3],
          bugs: num[4]
        },
        total: {
          all: num[5],
          art: num[6],
          design: num[7],
          code: num[8],
          bugs: num[9]
        }
      },
      sprint: {
        title: sprint.name,
        startDate: sprint.startDate,
        endDate: sprint.endDate
      }
    }));
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