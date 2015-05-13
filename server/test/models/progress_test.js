'use strict';

var Promise = require('bluebird');
Promise.longStackTraces();
var chai = require('chai');
var dirtyChai = require('dirty-chai');
chai.use(dirtyChai);
var expect = chai.expect;
require('co-mocha');
var Progress = require('../../models/progress');
var services = require('../../services');
var redis = Promise.promisifyAll(require('redis'));

describe('Progress', function() {
  var that = this;

  describe('query', function() {
    describe('no issues', function() {
      beforeEach(function() {
        that.issues = [];
      });

      it('returns an empty array', function *() {
        var progress = new Progress();
        var result = progress.query(that.issues);
        expect(result).to.eql([]);
      });
    });

    describe('filter by label', function() {
      beforeEach(function() {
        that.issues = [
          {
            id: '45',
            estimate: 3,
            status: 'Done',
            labels: ['art']
          },
          {
            id: '756',
            estimate: 1,
            status: 'To Do',
            labels: ['art', 'design']
          },
          {
            id: '421',
            estimate: 3,
            status: 'Done',
            labels: ['design']
          }
        ];
      });

      it('returns the correct progress', function *() {
        var progress = new Progress();
        var result = progress.query(that.issues, {labels: ['art']});
        expect(result).to.eql([
          {
            id: '45',
            estimate: 3,
            status: 'Done',
            labels: ['art']
          },
          {
            id: '756',
            estimate: 1,
            status: 'To Do',
            labels: ['art', 'design']
          }
        ]);
      });
    });

    describe('filter by sprint', function() {
      beforeEach(function() {
        that.issues = [
          {
            id: '45',
            estimate: 1,
            status: 'Done',
            sprints: [1]
          },
          {
            id: '756',
            estimate: 1,
            status: 'To Do',
            sprints: [1]
          },
          {
            id: '421',
            estimate: 3,
            status: 'Done',
            sprints: [2]
          }
        ];
      });

      it('returns the correct progress', function *() {
        var progress = new Progress();
        var result = progress.query(that.issues, {sprint: 1});
        expect(result).to.eql([
          {
            id: '45',
            estimate: 1,
            status: 'Done',
            sprints: [1]
          },
          {
            id: '756',
            estimate: 1,
            status: 'To Do',
            sprints: [1]
          }
        ]);
      });
    });

    describe('filter by type', function() {
      beforeEach(function() {
        that.issues = [
          {
            id: '45',
            estimate: 2,
            status: 'Done',
            type: 'Bug'
          },
          {
            id: '756',
            estimate: 3,
            status: 'To Do',
            type: 'Bug'
          },
          {
            id: '421',
            estimate: 3,
            status: 'Done',
            type: 'Story'
          }
        ];
      });

      it('returns the correct progress', function *() {
        var progress = new Progress();
        var result = yield progress.query(that.issues, {type: 'Bug'});
        expect(result).to.eql([
          {
            id: '45',
            estimate: 2,
            status: 'Done',
            type: 'Bug'
          },
          {
            id: '756',
            estimate: 3,
            status: 'To Do',
            type: 'Bug'
          }
        ]);
      });
    });
  });

  describe('calculate', function() {
    describe('no issues', function() {
      beforeEach(function() {
        that.issues = [];
      });

      it('returns 0', function *() {
        var progress = new Progress();
        var result = progress.calculate(that.issues);
        expect(result).to.eql(0);
      });
    });

    describe('issues', function() {
      beforeEach(function() {
        that.issues = [
          {
            id: '45',
            estimate: 3,
            status: 'Done',
            labels: ['art']
          },
          {
            id: '756',
            estimate: 1,
            status: 'To Do',
            labels: ['art', 'design']
          }
        ];
      });

      it('returns the correct progress', function *() {
        var progress = new Progress();
        var result = progress.calculate(that.issues);
        expect(result).to.eql(75);
      });
    });
  });

  describe('epicsInSprint', function() {
    describe('issues', function() {
      beforeEach(function() {
        that.issues = [
          {
            id: '29',
            labels: ['dev'],
            summary: 'The First Level',
            status: 'To Do',
            sprints: [1], // epic sprint should be unrelated
            type: 'Epic'
          },
          {
            id: '421',
            estimate: 3,
            labels: ['dev'],
            status: 'Done',
            sprints: [2],
            type: 'Story',
            epic: '29'
          },
          {
            id: '423',
            estimate: 1,
            labels: ['art', 'dev', 'design'],
            status: 'To Do',
            sprints: [2],
            type: 'Story',
            epic: '29'
          }
        ];
      });

      it('returns the title and id of the epic', function *() {
        var progress = new Progress();
        var result = progress.epicsInSprint(that.issues, 2);
        expect(result).to.eql([{title: 'The First Level', id: '29'}]);
      });
    });
  });

  describe('writeAll', function() {
    describe('bugs', function() {
      beforeEach(function *() {
        services.redisClient = redis.createClient();
        yield services.redisClient.selectAsync(15);
        yield services.redisClient.flushdbAsync();
        yield services.redisClient.setAsync('issue45', JSON.stringify({
          id: '45',
          estimate: 2,
          labels: ['art'],
          sprints: [1],
          status: 'Done',
          type: 'Bug'
        }));
        yield services.redisClient.setAsync('issue756', JSON.stringify({
          id: '756',
          estimate: 3,
          labels: ['art'],
          status: 'To Do',
          type: 'Bug'
        }));
        yield services.redisClient.setAsync('issue421', JSON.stringify({
          id: '421',
          estimate: 3,
          labels: [],
          status: 'Done',
          type: 'Story'
        }));
      });

      afterEach(function *() {
        services.redisClient.quit();
      });

      it('calculates progress', function *() {
        var progress = new Progress();
        yield progress.writeAll({id: 1, name: 'THE BEST SPRINT'});
        var results = JSON.parse(yield services.redisClient.getAsync('progress'));
        expect(results.total.bugs).to.equal(40);
      });
    });

    describe('art', function() {
      beforeEach(function *() {
        services.redisClient = redis.createClient();
        yield services.redisClient.selectAsync(15);
        yield services.redisClient.flushdbAsync();
        yield services.redisClient.setAsync('issue45', JSON.stringify({
          id: '45',
          estimate: 2,
          labels: ['art'],
          status: 'Done',
          type: 'Bug'
        }));
        yield services.redisClient.setAsync('issue421', JSON.stringify({
          id: '421',
          estimate: 1,
          labels: ['art'],
          status: 'Done',
          type: 'Story'
        }));
        yield services.redisClient.setAsync('issue423', JSON.stringify({
          id: '423',
          estimate: 3,
          labels: ['art', 'design'],
          status: 'To Do',
          type: 'Story'
        }));
        yield services.redisClient.setAsync('unrelated', 'snoogans');
      });

      it('calculates progress', function *() {
        var progress = new Progress();
        yield progress.writeAll({id: 1, name: 'THE BEST SPRINT'});
        var results = JSON.parse(yield services.redisClient.getAsync('progress'));
        expect(results.total.art).to.equal(25);
      });
    });

    describe('design', function() {
      beforeEach(function *() {
        services.redisClient = redis.createClient();
        yield services.redisClient.selectAsync(15);
        yield services.redisClient.flushdbAsync();
        yield services.redisClient.setAsync('issue45', JSON.stringify({
          id: '45',
          estimate: 2,
          labels: ['design'],
          status: 'Done',
          type: 'Bug'
        }));
        yield services.redisClient.setAsync('issue421', JSON.stringify({
          id: '421',
          estimate: 2,
          labels: ['design'],
          status: 'Done',
          type: 'Story'
        }));
        yield services.redisClient.setAsync('issue423', JSON.stringify({
          id: '423',
          estimate: 3,
          labels: ['art', 'design'],
          status: 'To Do',
          type: 'Story'
        }));
        yield services.redisClient.setAsync('unrelated', 'snoogans');
      });

      afterEach(function *() {
        services.redisClient.quit();
      });

      it('calculates progress', function *() {
        var progress = new Progress();
        yield progress.writeAll({id: 1, name: 'THE BEST SPRINT'});
        var results = JSON.parse(yield services.redisClient.getAsync('progress'));
        expect(results.total.design).to.equal(40);
      });
    });

    describe('code', function() {
      beforeEach(function *() {
        services.redisClient = redis.createClient();
        yield services.redisClient.selectAsync(15);
        yield services.redisClient.flushdbAsync();
        yield services.redisClient.setAsync('issue45', JSON.stringify({
          id: '45',
          estimate: 1,
          labels: ['dev'],
          status: 'Done',
          type: 'Bug'
        }));
        yield services.redisClient.setAsync('issue421', JSON.stringify({
          id: '421',
          estimate: 3,
          labels: ['dev'],
          status: 'Done',
          type: 'Story'
        }));
        yield services.redisClient.setAsync('issue423', JSON.stringify({
          id: '423',
          estimate: 1,
          labels: ['art', 'dev', 'design'],
          status: 'To Do',
          type: 'Story'
        }));
        yield services.redisClient.setAsync('unrelated', 'snoogans');
      });

      it('calculates progress', function *() {
        var progress = new Progress();
        yield progress.writeAll({id: 1, name: 'THE BEST SPRINT'});
        var results = JSON.parse(yield services.redisClient.getAsync('progress'));
        expect(results.total.code).to.equal(75);
      });
    });

    afterEach(function *() {
      services.redisClient.quit();
    });

    describe('epic', function() {
      beforeEach(function *() {
        services.redisClient = redis.createClient();
        yield services.redisClient.selectAsync(15);
        yield services.redisClient.flushdbAsync();
        yield services.redisClient.setAsync('issue29', JSON.stringify({
          id: '29',
          labels: ['dev'],
          summary: 'The First Level',
          status: 'To Do',
          sprints: [1], // epic sprint should be unrelated
          type: 'Epic'
        }));
        yield services.redisClient.setAsync('issue421', JSON.stringify({
          id: '421',
          estimate: 3,
          labels: ['dev'],
          status: 'Done',
          sprints: [2],
          type: 'Story',
          epic: '29'
        }));
        yield services.redisClient.setAsync('issue423', JSON.stringify({
          id: '423',
          estimate: 1,
          labels: ['art', 'dev', 'design'],
          status: 'To Do',
          sprints: [2],
          type: 'Story',
          epic: '29'
        }));
        yield services.redisClient.setAsync('unrelated', 'snoogans');
      });

      afterEach(function *() {
        services.redisClient.quit();
      });

      it('calculates progress for issues if their epics in the current sprint', function *() {
        var progress = new Progress();
        yield progress.writeAll({id: 2, name: 'The Second Sprint'});
        var results = JSON.parse(yield services.redisClient.getAsync('progress'));
        expect(results.epics).to.eql([
          {title: 'The First Level', progress: 75}
        ]);
      });
    });
  });
});