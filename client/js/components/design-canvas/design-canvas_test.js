'use strict';

describe('designCanvas', function() {
  var that = this;

  beforeEach(angular.mock.module('DeathWhimsy'));
  beforeEach(inject(function ($rootScope, _$compile_) {
    that.$compile = _$compile_;
    that.scope = $rootScope.$new();

    that.element = angular.element('<design-canvas></design-canvas>');
    that.element = that.$compile(that.element)(that.scope);
    that.scope.$digest();
    that.isolate = that.element.isolateScope();
  }));

  xit('does something', function() {
    expect(that.scope).to.be.false;
  });
});