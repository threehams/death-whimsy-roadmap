'use strict';

describe('autoHeight', function() {
  var that = this;

  beforeEach(angular.mock.module('DeathWhimsy'));
  beforeEach(inject(function ($rootScope, _$compile_, _$window_) {
    that.$compile = _$compile_;
    that.scope = $rootScope.$new();
    that.$window = _$window_;

    that.element = angular.element('<div auto-height></div>');
    that.compiled = that.$compile(that.element);
  }));

  it('does something', function() {
    that.$window.innerHeight = 400;
    var element = that.compiled(that.scope);
    that.scope.$digest();
    that.isolate = element.isolateScope();
    expect(element[0].style.minHeight).to.equal('400px');
    expect(element[0].style.maxHeight).to.equal('400px');
  });
});