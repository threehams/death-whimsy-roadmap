'use strict';

describe('CodeCanvasController', function() {
  var that = this;

  beforeEach(angular.mock.module('DeathWhimsy'));
  beforeEach(inject(function($rootScope, _$controller_) {
    that.scope = $rootScope;
    that.controller = _$controller_;
    that.controller('CodeCanvasController as vm', {'$scope': that.scope});
  }));

  it('does nothing', function() {

  });
});