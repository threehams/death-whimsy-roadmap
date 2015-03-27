'use strict';

describe('SectionProgressController', function() {
  var that = this;

  beforeEach(angular.mock.module('DeathWhimsy'));
  beforeEach(inject(function($rootScope, _$controller_) {
    that.scope = $rootScope;
    that.controller = _$controller_;
    that.controller('SectionProgressController as vm', {'$scope': that.scope});
  }));

  describe('full/empty jars', function() {
    it('fails', function() {
      expect(true).to.be.false;
    });
  });
});