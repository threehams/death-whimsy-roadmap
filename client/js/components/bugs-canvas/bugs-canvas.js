'use strict';

module.exports = [function() {
  return {
    restrict: 'E',
    scope: {
      current: '=',
      barMax: '=',
      barMin: '='
    },
    replace: true,
    template: require('./bugs-canvas-template.jade'),
    controller: require('./bugs-canvas-controller'),
    controllerAs: 'vm',
    bindToController: true,
    link: function(scope, element) {
      var canvas = element[0];
      var context = canvas.getContext('2d');
      var bugsImage;

      //window.addEventListener('scroll', function(event) {
      //  console.log(element);
      //});

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

      var progress = -1000;

      function loop() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        if (progress > 0) {
          showBugsImage();
        }

        context.fillRect(progress, 0, canvas.width, canvas.height);

        progress += 12;

        if (progress < 1050) {
          window.requestAnimationFrame(loop);
        }
      }

      scope.$watch('vm.bugsSrc', function(newValue) {
        if (!newValue) return;

        bugsImage = new Image();

        bugsImage.onload = function() {
          loop();
        };
        bugsImage.src = newValue;
      });
    }
  };
}];