'use strict';

var xml2js = require('xml2js');
var _ = require('lodash');

var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var parser = new xml2js.Parser();

fs.readFile('tmp/entities.xml', function(err, data) {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  parser.parseString(data, function(err, result) {
    if (err) {
      console.log(err);
      process.exit(1);
    }

    var base = result['entity-engine-xml'];

    //var issueTypes = getIssueTypes(base.IssueType);
    //console.log(issueTypes);

    //var linkTypes = getLinkTypes(base.IssueLinkType);
    //console.log(linkTypes);

    //var issueLinks = getIssueLinks(base.IssueLink);
    //console.log(issueLinks);

    logIssues(base.Issue);
    dirIssues(base.Issue);
    console.log(_.keys());
  });
});

/*

this is what I want

- find all issues:
  - ID
  - summary
  - description
  - label
  - sprint
- iterate through issues and divide between art, code, design, and bugs
- save issues for later use with webhooks
- calculate and cache percentage completion for each category and the overall sprint

issues: [
  id: '10292',
  summary: ''
]

 */

function getIssueLinks(links) {
  return _.map(links, function(link) {
    return link.$;
  });
}

function getIssueTypes(types) {
  return _.map(types, function(type) {
    return type.$;
  });
}

function getLinkTypes(linkTypes) {
  return _.map(linkTypes, function(type) {
    return type.$;
  });
}

function logIssues(issues) {
  _.forEach(issues, function(container) {
    var issue = container.$;
    console.log('ID:', issue.id, '-', issue.summary);
    console.log('Reporter:', issue.reporter);
    console.log('Assignee:', issue.assignee);
    console.log();
  });
}

function dirIssues(issues) {
  _.forEach(issues, function(container) {
    console.dir(container);
  });
}
