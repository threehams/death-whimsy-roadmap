'use strict';

module.exports = ['$window', '$q', 'ImagePreloader', 'Sprite', 'codeJars', function($window, $q, ImagePreloader, Sprite, codeJars) {
  return {
    restrict: 'E',
    scope: {
      active: '=',
      progressEnd: '='
    },
    replace: true,
    template: require('./code-canvas-template.jade'),
    controller: require('./code-canvas-controller'),
    controllerAs: 'vm',
    bindToController: true,
    link: function(scope, element) {
      var canvas = element[0].querySelector('canvas');
      var context = canvas.getContext('2d');
      var collection;
      var totalJars;

      var cancel = scope.$watch('vm.progressEnd', function(newValue) {
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
          scope.vm.jarImage = images[0];
          scope.vm.iconImage = images[1];
          scope.vm.loaded = true;

          // Combine them all, slice the array based on progress, and reverse so we can use pop() to go from start to finish
          collection = codeJars.slice(0, Math.floor(codeJars.length * (scope.vm.progressEnd / 100))).reverse();
          totalJars = collection.length;

          if (scope.vm.active) {
            scope.vm.loop();
          }
        });
      }


      var tick = 0;
      var jars = [];

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
        return new Sprite({context: context, image: scope.vm.iconImage, crop: [
          x, y, width, height
        ]});
      }

      scope.vm.digestLoop = function() {
        scope.vm.loop();
        scope.$digest();
      };

      var framesPerJar = 5;

      scope.vm.loop = function() {
        tick++;

        context.clearRect(0, 0, canvas.width, canvas.height);

        if (collection.length) {
          scope.vm.progress = (tick / framesPerJar) / totalJars * 100;
        }

        if (tick % framesPerJar === 0 && collection.length) {
          var position = collection.pop();

          var jar = new Jar(
            new Sprite({context: context, image: scope.vm.jarImage}),
            randomSpriteCrop(scope.vm.iconImage, 40, 40),
            {x: position[0], y: position[1] - scope.vm.jarImage.height} // coordinate list is based on bottom left!
          );

          jars.push(jar);
        } else if (tick % 3 && !collection.length) {
          scope.vm.done = true;
        }

        _.forEach(jars, function(jar) {
          jar.render();
        });

        if (scope.vm.active) {
          requestAnimationFrame(scope.vm.digestLoop);
        }
      };

      scope.$watch('vm.active', function(newValue) {
        if (newValue && scope.vm.loaded) {
          scope.vm.loop();
        }
      });
    }
  };
}];