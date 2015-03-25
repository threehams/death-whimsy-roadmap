'use strict';

module.exports = ['$window', function($window) {
  return {
    restrict: 'A',
    link: function (scope, element) {
      function onResize() {
        element[0].style.minHeight = $window.innerHeight.toString() + 'px';
        element[0].style.maxHeight = $window.innerHeight.toString() + 'px';
      }

      $window.onresize = onResize;
      onResize();
    }
  };
}];