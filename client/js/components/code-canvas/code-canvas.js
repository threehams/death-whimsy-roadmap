'use strict';

module.exports = function() {
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
};