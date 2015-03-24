'use strict';

module.exports = ['$window', function($window) {
  return {
    restrict: 'A',
    link: function (scope, element) {
      function onResize() {
        console.log('resizing to', $window.innerHeight.toString() + 'px');
        element[0].setAttribute('height', $window.innerHeight.toString() + 'px');
      }

      $window.onresize = onResize;
      onResize();
      scope.$on('$destroy', function() {
        console.log('destroyed');
      });
    }
  };
}];