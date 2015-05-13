'use strict';

describe('sectionProgress', function() {
  var that = this;

  beforeEach(angular.mock.module('DeathWhimsy'));
  beforeEach(inject(function ($rootScope, _$compile_) {
    that.$compile = _$compile_;
    that.scope = $rootScope.$new();

    that.element = angular.element('<section-progress description="\'All done!\'" progress="vm.progress" progress-end="vm.progressEnd"></section-progress>');
    that.compiled = that.$compile(that.element);
  }));

  describe('elements', function() {
    beforeEach(function() {
      that.element = that.compiled(that.scope);
    });

    it('hides the description while progress is below full', function() {
      that.scope.vm = {progress: 50, progressEnd: 100};
      that.scope.$digest();
      expect(that.element[0].innerHTML).to.not.match(/All done!/);
    });

    it('hides the description while progress is below full', function() {
      that.scope.vm = {progress: 100, progressEnd: 100};
      that.scope.$digest();
      that.isolate = that.element.isolateScope();
      expect(that.element[0].innerHTML).to.match(/All done!/);
    });
  });
});