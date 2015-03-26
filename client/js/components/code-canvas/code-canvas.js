'use strict';

module.exports = ['ImagePreloadService', 'Sprite', '$window', function(ImagePreloadService, Sprite, $window) {
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

      ImagePreloadService.load('/img/jar-empty.png').then(function(image) {
        scope.vm.loaded = true;
        jar = image;
        if (scope.vm.active) {
          scope.vm.loop();
        }
      });

      scope.vm.loop = function() {
        var x = _.random(0, canvas.width);
        var y = _.random(0, canvas.height);

        context.drawImage(
          jar,
          0,
          0,
          jar.width,
          jar.height,
          x,
          y,
          40,
          40
        );
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