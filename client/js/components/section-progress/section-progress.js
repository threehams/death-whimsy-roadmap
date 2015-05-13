'use strict';

module.exports = function() {
  return {
    restrict: 'E',
    scope: {
      description: '=',
      progress: '=',
      progressEnd: '='
    },
    replace: true,
    template: require('./section-progress-template.jade'),
    controller: require('./section-progress-controller'),
    controllerAs: 'vm',
    bindToController: true
  };
};