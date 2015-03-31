'use strict';

function DesignCanvas () {
  return {
    restrict: 'E',
    scope: {
      active: '=',
      progressEnd: '='
    },
    replace: true,
    template: require('./design-canvas-template.jade'),
    controller: require('./design-canvas-controller'),
    controllerAs: 'vm',
    bindToController: true,
    link: function(scope, element) {
      var canvas = element[0].querySelector('.design-canvas');
      scope.vm.context = canvas.getContext('2d');
      canvas.style.backgroundImage = 'url(/img/design-' + Math.floor(scope.vm.progressEnd / 10) * 10 + '.jpg)';
    }
  };
}

module.exports = DesignCanvas;