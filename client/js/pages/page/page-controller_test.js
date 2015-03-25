'use strict';

describe('PageController', function() {
  var that = this;

  beforeEach(angular.mock.module('DeathWhimsy'));
  beforeEach(inject(function($rootScope, _$controller_, _$q_) {
    that.scope = $rootScope;
    that.controller = _$controller_;
    that.q = _$q_;
    that.progressData = {
      total: {
        all: 5,
        art: 0,
        design: 0,
        code: 0,
        bugs: 0
      }
    };
    that.sprintData = {
      title: 'Sprint 5',
      startDate: new Date().toString(),
      endDate: new Date().toString()
    };
    that.fakeProgressService = {
      index: function() {
        var defer = that.q.defer();
        defer.resolve({
          progress: that.progressData,
          sprint: that.sprintData
        });
        return defer.promise;
      }
    };
  }));

  it('populates progress data', function() {
    that.controller('PageController as vm', {'$scope': that.scope, ProgressService: that.fakeProgressService});
    that.scope.$digest();
    expect(that.scope.vm.progress).to.eql(that.progressData);
  });
});