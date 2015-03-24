'use strict';

module.exports = ['$window', function($window) {
  return {
    restrict: 'A',
    link: function (scope, element) {
      function onResize() {
        element[0].setAttribute('height', $window.innerHeight.toString() + 'px');
      }

      $window.onresize = onResize;
      onResize();
    }
  };
}];