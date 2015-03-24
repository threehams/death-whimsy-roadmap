'use strict';

module.exports = function() {
  return {
    restrict: 'E',
    scope: true,
    transclude: true,
    template: require('./slideshow-template.jade'),
    controller: require('./slideshow-controller'),
    controllerAs: 'vm',
    bindToController: true
  };
};