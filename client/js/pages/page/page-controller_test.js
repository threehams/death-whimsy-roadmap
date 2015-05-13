'use strict';

describe('PageController', function() {
  var that = this;

  beforeEach(angular.mock.module('DeathWhimsy'));
  beforeEach(inject(function($rootScope, _$controller_, _$q_) {
    that.scope = $rootScope;
    that.controller = _$controller_;
    that.q = _$q_;
    that.totalProgress = {
      art: 0,
      design: 0,
      code: 0
    };
    that.epicsData = {
      title: 'Death Animation',
      progress: 90
    };
    that.fakeProgressService = {
      index: function() {
        var defer = that.q.defer();
        defer.resolve({
          total: that.totalProgress,
          epics: that.epicsData
        });
        return defer.promise;
      }
    };
  }));

  it('populates progress data', function() {
    that.controller('PageController as vm', {'$scope': that.scope, ProgressService: that.fakeProgressService});
    that.scope.$digest();
    expect(that.scope.vm.totalProgress).to.eql(that.totalProgress);
  });
});