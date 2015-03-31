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
  this.scales = [0.2, 0.3, 0.5, 1.2, null].reverse(); // reverse to use pop(), but still be readable
}

Jar.prototype.render = function() {
  var scale = this.scales.length ? this.scales.pop() : null;
  this.icon.render(this.x + 6, this.y + 11, scale);
  this.sprite.render(this.x, this.y, scale);
};

module.exports = ['$scope', '$q', '$window', 'ImagePreloader', 'Sprite', 'codeJars', function ($scope, $q, $window, ImagePreloader, Sprite, codeJars) {
  var vm = this;

  vm.progress = 0;
  vm.description = 'Code is done!';

  vm.framesPerJar = 5;

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

  vm.loop = function() {
    vm.tick++;

    vm.context.clearRect(0, 0, 1000, 563); // TODO sort-of DOM manipulation in controller - how to handle this? Canvas complicates everything

    if (vm.collection.length) {
      vm.progress = (vm.tick / vm.framesPerJar) / vm.totalJars * 100;
    }

    if (vm.tick % vm.framesPerJar === 0 && vm.collection.length) {
      var position = vm.collection.pop();

      var jar = new Jar(
        new Sprite({context: vm.context, image: vm.jarImage}),
        randomSpriteCrop(vm.iconImage, 40, 40),
        {x: position[0], y: position[1] - vm.jarImage.height} // coordinate list is based on bottom left!
      );

      vm.jars.push(jar);
    } else if (vm.tick % 3 && !vm.collection.length) {
      vm.done = true;
    }

    _.forEach(vm.jars, function(jar) {
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