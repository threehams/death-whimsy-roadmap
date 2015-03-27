'use strict';

module.exports = function() {
  return {
    restrict: 'E',
    scope: {
      title: '=',
      progress: '='
    },
    replace: true,
    template: require('./progress-jar-template.jade'),
    controller: require('./progress-jar-controller'),
    controllerAs: 'vm',
    bindToController: true
  };
};