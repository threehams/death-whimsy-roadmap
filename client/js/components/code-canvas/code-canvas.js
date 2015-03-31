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
      scope.vm.context = canvas.getContext('2d');
    }
  };
}];