'use strict';

describe('sectionProgress', function() {
  var that = this;

  beforeEach(angular.mock.module('DeathWhimsy'));
  beforeEach(inject(function ($rootScope, _$compile_) {
    that.$compile = _$compile_;
    that.scope = $rootScope.$new();

    that.element = angular.element('<section-progress description="\'All done!\'" current="vm.progress"></section-progress>');
    that.compiled = that.$compile(that.element);
  }));

  describe('elements', function() {
    beforeEach(function() {
      that.element = that.compiled(that.scope);
      that.scope.$digest();
    });

    it('fails', function() {
      expect(true).to.equal(false);
    });
  });
});