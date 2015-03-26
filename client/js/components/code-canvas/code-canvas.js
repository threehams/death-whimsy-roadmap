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
      var jar;
      var icon;

      $q.all([
        ImagePreloadService.load('/img/jar-empty-50px.png'),
        ImagePreloadService.load('/img/code-icons.png')
      ]).then(function(images) {
        jar = images[0];
        icon = images[1];
        scope.vm.loaded = true;
        if (scope.vm.active) {
          scope.vm.loop();
        }
      });

      var row1 = _.shuffle([
        [16, 191], [64, 190],
        [19, 306], [69, 310], [130, 312], [181, 315], [243, 319],
        [134, 448], [182, 448], [249, 450], [304, 449],
        [181, 539], [247, 540], [303, 539]
      ]);
      var row2 = _.shuffle([
        [9, 146], [70, 144],
        [66, 264], [148, 268],
        [137, 404], [184, 404], [276, 404]
      ]);

      var tick = 0;

      scope.vm.loop = function() {
        tick++;
        if (tick % 5) {
          requestAnimationFrame(scope.vm.loop);
          return;
        }
        var position;
        if (row1.length) {
          position = row1.pop();
        } else if (row2.length) {
          position = row2.pop();
        } else {
          return;
        }
        var x = position[0];//_.random(0, canvas.width);
        var y = position[1] - 45;//_.random(0, canvas.height);
        var iconX = _.random(0, 4);
        var iconY = _.random(0, 4);

        context.drawImage(
          icon,
          iconX * 40,
          iconY * 40,
          iconX + 40,
          iconY + 40,
          x + 12,
          y + 15,
          30,
          30
        );
        context.drawImage(
          jar,
          0,
          0,
          jar.width,
          jar.height,
          x,
          y,
          50,
          50
        );

        if (scope.vm.active && (row1.length || row2.length)) {
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