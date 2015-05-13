'use strict';

describe('artCanvas', function() {
  var that = this;

  beforeEach(angular.mock.module('DeathWhimsy'));
  beforeEach(inject(function ($rootScope, _$compile_) {
    that.$compile = _$compile_;
    that.scope = $rootScope.$new();

    that.element = angular.element('<art-canvas></art-canvas>');
    that.element = that.$compile(that.element)(that.scope);
    that.scope.$digest();
    that.isolate = that.element.isolateScope();
  }));

  xit('does something', function() {

  });
});