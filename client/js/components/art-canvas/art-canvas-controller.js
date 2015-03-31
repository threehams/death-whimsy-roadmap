'use strict';

function Timelapse(context, image, width, height, opts) {
  this.context = context;
  this.image = image;
  this.tick = 0;
  this.framesPerSecond = 5;
  this.frame = 0;
  this.frameCount = 98;
  this.width = width;
  this.height = height;
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

  vm.tick = 0;

  vm.digestLoop = function() {
    vm.loop();
    $scope.$digest();
  };

  vm.loop = function() {
    vm.tick++;

    vm.timelapse.update();
    vm.timelapse.render();

    vm.progress = vm.tick / ((vm.timelapse.endFrame) * 6) * 100; // frames * fps

    if (vm.active && !vm.timelapse.done) {
      $window.requestAnimationFrame(vm.digestLoop);
    } else if (vm.active) {
      vm.done = true;
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

  function startLoop() {
    ImagePreloader.load('/img/timelapse.jpg').then(function(image) {
      vm.timelapse = new Timelapse(
        vm.context,
        image,
        1000,
        563,
        {endFrame: Math.ceil(98 * (vm.progressEnd / 100)) }
      );
      vm.loaded = true;

      if (vm.active) {
        vm.video.play();
        vm.loop();
      }
    });
  }
}];