'use strict';

function Timelapse(context, image, width, height) {
  this.context = context;
  this.image = image;
  this.tick = 0;
  this.framesPerSecond = 5;
  this.frame = 0;
  this.frameCount = 98;
  this.width = width;
  this.height = height;
}

Timelapse.prototype.update = function() {
  if (this.frame > this.frameCount) {
    this.done = true;
  }
};

Timelapse.prototype.render = function() {
  if (this.done) return;
  if (this.tick % (30 / this.framesPerSecond) === 0) {
    this.context.drawImage(
      this.image,
      this.frame * (this.image.width / this.frameCount),
      0,
      this.image.width / this.frameCount,
      this.image.height,
      0,
      0,
      this.width,
      this.height
    );
    this.frame++;
  }
  this.tick++;
};

module.exports = ['$window', 'ImagePreloader', function($window, ImagePreloader) {
  return {
    restrict: 'E',
    scope: {
      active: '=',
      progressEnd: '='
    },
    replace: true,
    template: require('./art-canvas-template.jade'),
    controller: require('./art-canvas-controller'),
    controllerAs: 'vm',
    bindToController: true,
    link: function(scope, element) {
      var canvas = element[0].querySelector('canvas');
      scope.vm.video = element[0].querySelector('video');
      scope.vm.context = canvas.getContext('2d');
      scope.vm.tick = 0;

      scope.vm.digestLoop = function() {
        scope.vm.loop();
        scope.$digest();
      };

      scope.vm.loop = function() {
        scope.vm.tick++;

        scope.vm.timelapse.update();
        scope.vm.timelapse.render();

        scope.vm.progress = scope.vm.tick / 588 * 100; // frames * fps

        if (scope.vm.active && !scope.vm.timelapse.done) {
          $window.requestAnimationFrame(scope.vm.digestLoop);
        } else if (scope.vm.active) {
          scope.vm.done = true;
          scope.vm.video.pause();
        }
      };

      scope.$watch('vm.active', function(newValue) {
        if (newValue) {
          if (!scope.vm.done && scope.vm.loaded) {
            scope.vm.video.play();
            scope.vm.loop();
          }
        } else {
          scope.vm.video.pause();
        }
      });

      scope.$watch('vm.progressEnd', function(newValue) {
        if (newValue) {
          startLoop();
        }
      });

      function startLoop() {
        ImagePreloader.load('/img/timelapse.jpg').then(function(image) {
          scope.vm.timelapse = new Timelapse(
            scope.vm.context,
            image,
            1000,
            563
          );
          scope.vm.loaded = true;

          if (scope.vm.active) {
            scope.vm.video.play();
            scope.vm.loop();
          }
        });
      }
    }
  };
}];