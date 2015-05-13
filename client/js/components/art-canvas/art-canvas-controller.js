'use strict';

function Timelapse(context, image, opts) {
  this.context = context;
  this.image = image;
  this.tick = 0;
  this.framesPerSecond = 5;
  this.frame = 0;
  this.frameCount = opts.frameCount;
  this.width = opts.width;
  this.height = opts.height;
  this.endFrame = opts.endFrame;
}

Timelapse.prototype.update = function() {
  if (this.frame > this.endFrame) {
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

module.exports = ['$window', '$scope', 'ImagePreloader', function ($window, $scope, ImagePreloader) {
  var vm = this;

  vm.touch = false; // TODO this should not be hardcoded - Modernizr?
  vm.progress = 0;
  vm.description = 'Art is done!';
  // Minimum number of animation frames to show at 0% progress.
  // Without this, low progress is very jarring...
  vm.minFrames = 20;
  vm.frameCount = 98;

  vm.tick = 0;

  vm.digestLoop = function() {
    vm.loop();
    $scope.$digest();
  };

  vm.loop = function() {
    vm.tick++;

    vm.timelapse.update();
    vm.timelapse.render();

    vm.progress = vm.tick / ((vm.timelapse.endFrame) * 6 + vm.minFrames) * 100; // frames + 5 second lead-in time * fps

    if (vm.active && vm.progress < 100) {
      $window.requestAnimationFrame(vm.digestLoop);
    } else if (vm.active) {
      vm.done = true;
      vm.progress = 100;
      vm.video.pause();
    }
  };

  $scope.$watch('vm.active', function(newValue) {
    if (newValue) {
      if (!vm.done && vm.loaded) {
        vm.video.play();
        vm.loop();
      }
    } else {
      vm.video.pause();
    }
  });

  $scope.$watch('vm.progressEnd', function(newValue) {
    if (newValue !== undefined) {
      startLoop();
    }
  });

  function getEndFrame(progress) {
    return vm.minFrames + Math.ceil((vm.frameCount - vm.minFrames) * (progress / 100));
  }

  function startLoop() {
    ImagePreloader.load('/img/timelapse.jpg').then(function(image) {
      vm.timelapse = new Timelapse(
        vm.context,
        image,
        {
          width: 1000,
          height: 563,
          endFrame: getEndFrame(vm.progressEnd),
          frameCount: vm.frameCount
        }
      );
      vm.loaded = true;

      if (vm.active) {
        vm.video.play();
        vm.loop();
      }
    });
  }
}];