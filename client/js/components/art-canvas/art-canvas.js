'use strict';

module.exports = ['Character', 'Sprite', 'DesignSequence', '$window', function(Character, Sprite, DesignSequence, $window) {
  return {
    restrict: 'E',
    scope: {
      active: '='
    },
    replace: true,
    template: require('./art-canvas-template.jade'),
    controller: require('./art-canvas-controller'),
    controllerAs: 'vm',
    bindToController: true,
    link: function(scope, element) {
      var canvas = element[0].querySelector('canvas');
      var video = element[0].querySelector('video');
      var context = canvas.getContext('2d');
      var timelapseImage;
      var frame = 0;
      var progress = 0;
      var frames = 98;
      var framesPerSecond = 5;
      var tick = 0;

      function drawTimelapse() {
        if (tick % (30 / framesPerSecond) === 0) {
          context.drawImage(
            timelapseImage,
            frame * (timelapseImage.width / frames),
            0,
            timelapseImage.width / frames,
            timelapseImage.height,
            0,
            0,
            canvas.width,
            canvas.height
          );
          frame++;
        }
        tick++;
      }

      scope.vm.loop = function() {
        drawTimelapse();

        if (frame !== progress) {
          progress = frame;
          scope.vm.progress = progress * (scope.vm.currentProgress / frames);
        }

        if (frame < frames && scope.vm.active) {
          $window.requestAnimationFrame(scope.vm.loop);
          scope.$digest();
        } else {
          scope.vm.done = true;
          scope.$digest();
        }
      };

      scope.$watch('vm.active', function(newValue) {
        if (newValue) {
          video.play();
          scope.vm.loop();
        } else {
          video.pause();
        }
      });

      scope.$watch('vm.timelapseSrc', function(newValue) {
        if (!newValue) return;

        timelapseImage = new Image();

        timelapseImage.onload = function() {
          if (scope.vm.active) {
            scope.vm.loop();
          }
        };
        timelapseImage.src = newValue;
      });
    }
  };
}];