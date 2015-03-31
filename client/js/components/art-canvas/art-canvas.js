'use strict';

module.exports = ['$window', 'ImagePreloader', function($window, ImagePreloader) {
  return {
    restrict: 'E',
    scope: {
      active: '=',
      progressEnd: '='
    },
    replace: true,
    template: require('./art-canvas-template.jade'),
    controller: require('./art-canvas-controller'),
    controllerAs: 'vm',
    bindToController: true,
    link: function(scope, element) {
      var canvas = element[0].querySelector('canvas');
      scope.vm.video = element[0].querySelector('video');
      scope.vm.context = canvas.getContext('2d');
    }
  };
}];