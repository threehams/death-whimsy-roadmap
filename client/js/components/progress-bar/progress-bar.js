'use strict';

module.exports = function() {
  return {
    restrict: 'E',
    scope: {
      current: '=',
      barMax: '=',
      barMin: '='
    },
    replace: true,
    template: require('./progress-bar-template.jade'),
    controller: require('./progress-bar-controller'),
    controllerAs: 'vm',
    bindToController: true
  };
};