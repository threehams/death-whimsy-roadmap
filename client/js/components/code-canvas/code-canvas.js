'use strict';

module.exports = ['$window', '$q', 'ImagePreloadService', 'Sprite', function($window, $q, ImagePreloadService, Sprite) {
  return {
    restrict: 'E',
    scope: {
      active: '='
    },
    replace: true,
    template: require('./code-canvas-template.jade'),
    controller: require('./code-canvas-controller'),
    controllerAs: 'vm',
    bindToController: true,
    link: function(scope, element) {
      var canvas = element[0].querySelector('canvas');
      var context = canvas.getContext('2d');
      var jarImage;
      var iconImage;

      $q.all([
        ImagePreloadService.load('/img/jar-empty-50px.png'),
        ImagePreloadService.load('/img/code-icons.png')
      ]).then(function(images) {
        jarImage = images[0];
        iconImage = images[1];
        scope.vm.loaded = true;
        if (scope.vm.active) {
          scope.vm.loop();
        }
      });

      // Coordinates for the jars. Since some are stacked, fill in the bottom ones first, then the top.
      // Fill out the left before the right, to make progress easier to see.
      // TODO May want to split this into four section to make progress clearer day-to-day.
      var row1left = _.shuffle([
        [16, 195], [64, 194], [134, 196], [180, 197],
        [19, 311], [69, 315], [130, 317], [181, 320], [243, 324], [303, 327],
        [134, 453], [182, 453], [249, 455], [304, 454], [374, 454], [421, 455],
        [181, 544], [247, 545], [303, 544], [376, 546], [421, 546]
      ]);
      var row2left = _.shuffle([
        [9, 151], [70, 149], [158, 149],
        [66, 269], [148, 273],
        [137, 409], [184, 409], [276, 409], [373, 407]
        // no row2 jars on bottom row
      ]);

      var row1right = _.shuffle([
        [813, 187], [862, 189], [933, 190],
        [660, 345], [725, 341], [774, 340], [820, 336], [932, 332], [865, 335],
        [598, 455], [659, 454], [734, 454], [784, 454], [929, 452],
        [601, 546], [650, 545], [728, 545], [777, 546], [830, 544], [931, 545]
      ]);
      var row2right = _.shuffle([
        [863, 145], [935, 145],
        [816, 292], [865, 292], [932, 286],
        [660, 403], [738, 403], [791, 403], [937, 406]
        // no row2 jars on bottom row
      ]);

      var tick = 0;
      var jars = [];

      // Combine them all, slice the array based on progress, and reverse so we can use pop() to go from start to finish
      var collection = row1left.concat(row2left).concat(row1right).concat(row2right);
      collection = collection.slice(0, Math.floor(collection.length * (scope.vm.currentProgress / 100)));
      collection = collection.reverse();
      var totalJars = collection.length;

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
        return new Sprite({context: context, image: iconImage, crop: [
          x, y, width, height
        ]});
      }

      scope.vm.loop = function() {
        tick++;

        context.clearRect(0, 0, canvas.width, canvas.height);

        if (tick % 3 === 0 && collection.length) {
          var position = collection.pop();

          var jar = new Jar(
            new Sprite({context: context, image: jarImage}),
            randomSpriteCrop(iconImage, 40, 40),
            {x: position[0], y: position[1] - jarImage.height} // coordinate list is based on bottom left!
          );

          jars.push(jar);
          scope.vm.progress = (jars.length / totalJars) * (scope.vm.currentProgress / 100) * 100;
          scope.$digest();
        } else if (tick % 3 && !collection.length) {
          scope.vm.done = true;
          scope.$digest();
        }

        _.forEach(jars, function(jar) {
          jar.render();
        });

        if (scope.vm.active) {
          requestAnimationFrame(scope.vm.loop);
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