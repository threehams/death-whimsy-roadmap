'use strict';

/*
 * Jar object, handles its own animation and rendering.
 * Inlined since it's not yet used outside of this controller.
 */
function Jar(sprite, icon, opts) {
  this.x = opts.x;
  this.y = opts.y;
  this.sprite = sprite;
  this.icon = icon;
  this.scales = [0.2, 0.3, 0.5, 1.2];
  this.frame = 0;
}

Jar.prototype.clear = function() {
  this.sprite.clear(this.x, this.y, this.scales[this.frame]);
};

Jar.prototype.update = function() {
  this.frame++;
};

Jar.prototype.render = function() {
  var scale = this.scales[this.frame] ? this.scales[this.frame] : null;
  this.icon.render(this.x + 6, this.y + 11, scale);
  this.sprite.render(this.x, this.y, scale);
};

module.exports = ['$scope', '$q', '$window', 'ImagePreloader', 'Sprite', 'codeJars', function ($scope, $q, $window, ImagePreloader, Sprite, codeJars) {
  var vm = this;

  vm.progress = 0;
  vm.description = 'Code is done!';
  vm.framesPerJar = 30;

  var cancel = $scope.$watch('vm.progressEnd', function(newValue) {
    if (newValue !== undefined) {
      startLoop();
      cancel();
    }
  });

  function startLoop() {
    $q.all([
      ImagePreloader.load('/img/jar-empty-50px.png'),
      ImagePreloader.load('/img/code-icons.png')
    ]).then(function(images) {
      vm.jarImage = images[0];
      vm.iconImage = images[1];
      vm.loaded = true;

      // Combine them all, slice the array based on progress, and reverse so we can use pop() to go from start to finish
      vm.collection = codeJars.slice(0, Math.floor(codeJars.length * (vm.progressEnd / 100))).reverse();
      vm.totalJars = vm.collection.length;
      vm.tick = 0;
      vm.jars = [];
      // Run a simulation to see how much progress should be incremented per tick
      vm.progressPerTick = 100 / _.reduce(vm.collection, function(sum) {
        return sum + vm.getFramesPerJar(sum);
      }, 1);
      console.log(vm.progressPerTick);

      if (vm.active) {
        vm.loop();
      }
    });
  }

  /*
   * Pick a random crop from a larger image of sprites. Will follow grid lines.
   *
   * @param image     Image element instance
   * @param width     Width of the crop to take
   * @param height    Height of the crop to take
   */
  function randomSpriteCrop(image, width, height) {
    var x = _.random(0, image.width / width - 1) * width;
    var y = _.random(0, image.height / height - 1) * height;
    return new Sprite({context: vm.context, image: vm.iconImage, crop: [
      x, y, width, height
    ]});
  }

  vm.digestLoop = function() {
    vm.loop();
    $scope.$digest();
  };

  /*
   * Get the number of frames to skip before the next jar is drawn.
   * Starts at 30 frames and speeds up gradually before capping at 2 frames.
   */
  vm.getFramesPerJar = function(tick) {
    return Math.max(Math.round(30 - Math.pow(tick / 25, 2)), 2);
  };

  /*
   * Pop jars onto the canvas to show progress as time goes on.
   */
  vm.loop = function() {
    vm.tick++;

    if (vm.progress < 100) vm.progress = vm.tick * vm.progressPerTick;

    if (vm.tick % vm.framesPerJar === 0 && vm.collection.length) {
      var position = vm.collection.pop();

      var jar = new Jar(
        new Sprite({context: vm.context, image: vm.jarImage}),
        randomSpriteCrop(vm.iconImage, 40, 40),
        {x: position[0], y: position[1] - vm.jarImage.height} // coordinate list is based on bottom left!
      );

      // keep track of the jars which need to be rendered each frame
      // TODO only clear the half of the canvas which is active
      vm.jars.push(jar);
      vm.framesPerJar = vm.getFramesPerJar(vm.tick);
    } else if (vm.tick % 3 && !vm.collection.length) {
      vm.done = true;
    }

    _.forEach(vm.jars, function(jar) { jar.clear(); });
    _.forEach(vm.jars, function(jar) {
      jar.update();
      jar.render();
    });

    if (vm.active) {
      $window.requestAnimationFrame(vm.digestLoop);
    }
  };

  $scope.$watch('vm.active', function(newValue) {
    if (newValue && vm.loaded) {
      vm.loop();
    }
  });
}];