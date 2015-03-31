'use strict';

describe('DesignCanvasController', function() {
  var that = this;
  var $q;
  var vm;

  beforeEach(angular.mock.module('DeathWhimsy'));
  beforeEach(inject(function(_$rootScope_, _$controller_, _$q_) {
    that.scope = _$rootScope_;
    that.controller = _$controller_;
    $q = _$q_;

    that.fakeContext = {
      clearRect: function() {},
      drawImage: function() {}
    };
    that.fakeImagePreloader = {
      load: function(url) {
        return $q(function(resolve, reject) {
          resolve(new Image());
        });
      }
    };
  }));

  describe('initialization', function() {
    beforeEach(function() {
      that.controller('DesignCanvasController as vm', {'$scope': that.scope, ImagePreloader: that.fakeImagePreloader});
      vm = that.scope.vm;
    });

    it('creates a character from the images', function() {
      that.scope.$digest();
      expect(vm.morgan.state).to.eql('running');
    });
  });

  describe('sequence', function() {
    beforeEach(function() {
      that.sequences = {};
      that.sequences[10] = {
        1: function (character) {
          if (character.x > 3) {
            return true;
          }
        },
        complete: {text: 'DONE!', x: 350, y: 350},
        frames: 5
      };
      that.fakeWindow = {
        requestAnimationFrame: function() {}
      };
      that.controller('DesignCanvasController as vm', {
        $scope: that.scope,
        $window: that.fakeWindow,
        ImagePreloader: that.fakeImagePreloader,
        DesignSequence: that.sequences
      });
      vm = that.scope.vm;
      vm.context = that.fakeContext;
      vm.progressEnd = 10;
    });

    it('moves to the next step', function() {
      that.scope.$digest();
      expect(vm.step).to.eql(1);
      vm.morgan.x = 4;
      vm.loop();
      that.scope.$digest();
      expect(vm.step).to.eql(2);
    });
  });
});