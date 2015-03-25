'use strict';

describe('ArtCanvasController', function() {
  var that = this;

  beforeEach(angular.mock.module('DeathWhimsy'));
  beforeEach(inject(function($rootScope, _$controller_) {
    that.scope = $rootScope;
    that.controller = _$controller_;
    that.controller('ArtCanvasController as vm', {'$scope': that.scope});
  }));

  it('does nothing', function() {

  });
});