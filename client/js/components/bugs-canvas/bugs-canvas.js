'use strict';

module.exports = [function() {
  return {
    restrict: 'E',
    scope: {
      active: '='
    },
    replace: true,
    template: require('./bugs-canvas-template.jade'),
    controller: require('./bugs-canvas-controller'),
    controllerAs: 'vm',
    bindToController: true,
    link: function(scope, element) {
      var canvas = element[0].querySelector('.bugs-canvas');
      var context = canvas.getContext('2d');
      var bugsImage;

      function showBugsImage() {
        context.drawImage(
          bugsImage,
          0,
          0,
          bugsImage.width,
          bugsImage.height,
          0,
          0,
          bugsImage.width,
          bugsImage.height
        );
      }

      var progress = -1500;

      scope.vm.loop = function() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        if (progress > 0) {
          showBugsImage();
        }

        context.fillRect(progress, 0, canvas.width, canvas.height);

        progress += 12;

        if (progress < 1050) {
          if (scope.vm.active) {
            window.requestAnimationFrame(scope.vm.loop);
          }
        } else {
          scope.vm.progressDone = true;
          scope.$digest();
        }
      };

      scope.$watch('vm.active', function(newValue) {
        if (newValue) {
          scope.vm.loop();
        }
      });

      scope.$watch('vm.bugsSrc', function(newValue) {
        if (!newValue) return;

        bugsImage = new Image();

        bugsImage.onload = function() {
          if (scope.vm.active) {
            scope.vm.loop();
          }
        };
        bugsImage.src = newValue;
      });
    }
  };
}];