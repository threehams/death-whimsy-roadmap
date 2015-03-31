'use strict';

module.exports = ['$timeout', function ($timeout) {
  var vm = this;

  vm.touch = false; // TODO this should not be hardcoded - Modernizr?
  vm.progress = 0;
  vm.description = 'Art is done!';
}];