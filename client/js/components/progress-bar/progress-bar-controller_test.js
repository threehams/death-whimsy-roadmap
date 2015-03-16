'use strict';

describe('ProgressBarController', function() {
  var that = this;

  beforeEach(angular.mock.module('SampleApp'));
  beforeEach(inject(function($rootScope, _$controller_) {
    that.scope = $rootScope;
    that.controller = _$controller_;
    that.controller('ProgressBarController as vm', {'$scope': that.scope});
  }));

  it('does nothing', function() {

  });
});