'use strict';

describe('slideshow', function() {
  var that = this;

  function toArray(classList) {
    return Array.prototype.slice.call(this, classList);
  }

  beforeEach(angular.mock.module('DeathWhimsy'));
  beforeEach(inject(function ($rootScope, _$compile_) {
    that.$compile = _$compile_;
    that.scope = $rootScope.$new();

    that.element = angular.element('<slideshow slides="vm.slides"><div class="slideshow-slide"></div><div class="slideshow-slide"></div></slideshow>');
    that.compiled = that.$compile(that.element);
  }));

  describe('elements', function() {
    beforeEach(function() {
      that.scope.vm = {
        slides: [
          {},
          {}
        ]
      };
      that.element = that.compiled(that.scope);
      that.scope.$digest();
      that.isolate = that.element.isolateScope();
    });

    it('moves forward to the correct margin offset', function() {
      that.isolate.vm.forward();
      that.scope.$digest();
      expect(that.element[0].querySelector('.slideshow-container').style.marginLeft).to.equal('-100%');
    });

    it('moves back to the correct margin offset', function() {
      that.isolate.vm.slide = 1;
      that.isolate.vm.back();
      that.scope.$digest();
      expect(that.element[0].querySelector('.slideshow-container').style.marginLeft).to.equal('0%');
    });

    it('disables the left arrow at start', function() {
      that.isolate.vm.slide = 0;
      that.scope.$digest();
      expect(that.element[0].querySelector('.slideshow-arrow-left').classList.contains('enabled')).to.be.false;
    });

    it('disables the right arrow at end', function() {
      that.isolate.vm.slide = 1;
      that.scope.$digest();
      expect(that.element[0].querySelector('.slideshow-arrow-right').classList.contains('enabled')).to.be.false;
    });

    it('enables the left arrow when going forward', function() {
      that.isolate.vm.slide = 0;
      that.isolate.vm.forward();
      that.scope.$digest();
      expect(that.element[0].querySelector('.slideshow-arrow-left').classList.contains('enabled')).to.be.true;
    });

    it('enables the right arrow when going back', function() {
      that.isolate.vm.slide = 1;
      that.isolate.vm.back();
      that.scope.$digest();
      expect(that.element[0].querySelector('.slideshow-arrow-right').classList.contains('enabled')).to.be.true;
    });
  });
});