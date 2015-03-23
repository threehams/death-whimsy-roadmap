'use strict';

describe('DesignCanvasController', function() {
  var that = this;

  beforeEach(angular.mock.module('SampleApp'));
  beforeEach(inject(function($rootScope, _$controller_) {
    that.scope = $rootScope;
    that.controller = _$controller_;
    that.controller('DesignCanvasController as vm', {'$scope': that.scope});
  }));

  it('does nothing', function() {

  });
});