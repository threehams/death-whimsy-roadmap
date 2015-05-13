'use strict';

describe('SlideshowController', function() {
  var that = this;

  beforeEach(angular.mock.module('DeathWhimsy'));
  beforeEach(inject(function($rootScope, _$controller_) {
    that.scope = $rootScope;
    that.controller = _$controller_;
    that.controller('SlideshowController as vm', {'$scope': that.scope});
  }));

  describe('slideshow', function() {
    it('', function() {

    });
  });
});