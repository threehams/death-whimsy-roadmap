'use strict';

describe('ProgressJarController', function() {
  var that = this;

  beforeEach(angular.mock.module('DeathWhimsy'));
  beforeEach(inject(function($rootScope, _$controller_) {
    that.scope = $rootScope;
    that.controller = _$controller_;
    that.controller('ProgressJarController as vm', {'$scope': that.scope});
  }));

  describe('full/empty jars', function() {
    it('calculates 4 full jars at 40%', function() {
      that.scope.vm.progress = 40;
      that.scope.$digest();
      expect(that.scope.vm.jarsFull).to.have.length(4);
      expect(that.scope.vm.jarsEmpty).to.have.length(6);
    });

    it('calculates 5 full jars at 49%', function() {
      that.scope.vm.progress = 49;
      that.scope.$digest();
      expect(that.scope.vm.jarsFull).to.have.length(5);
      expect(that.scope.vm.jarsEmpty).to.have.length(5);
    });

    it('calculates 0 full jars at 0%', function() {
      that.scope.vm.progress = 0;
      that.scope.$digest();
      expect(that.scope.vm.jarsFull).to.have.length(0);
      expect(that.scope.vm.jarsEmpty).to.have.length(10);
    });

    it('calculates 10 full jars at 100%', function() {
      that.scope.vm.progress = 100;
      that.scope.$digest();
      expect(that.scope.vm.jarsFull).to.have.length(10);
      expect(that.scope.vm.jarsEmpty).to.have.length(0);
    });
  });
});