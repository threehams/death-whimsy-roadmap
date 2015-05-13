'use strict';

describe('SectionProgressController', function() {
  var that = this;

  beforeEach(angular.mock.module('DeathWhimsy'));
  beforeEach(inject(function($rootScope, _$controller_) {
    that.scope = $rootScope;
    that.controller = _$controller_;
    that.controller('SectionProgressController as vm', {'$scope': that.scope});
  }));

  describe('current progress', function() {
    it('calculates current progress', function() {
      that.scope.vm.progress = 50;
      that.scope.vm.progressEnd = 40;
      expect(that.scope.vm.current()).to.equal(20);
    });
  });
});