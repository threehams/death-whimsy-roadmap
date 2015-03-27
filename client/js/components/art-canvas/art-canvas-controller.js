'use strict';

module.exports = ['$timeout', function ($timeout) {
  var vm = this;

  vm.currentProgress = 45;

  $timeout(function() {
    vm.timelapseSrc = '/img/timelapse.jpg';
  });

  vm.touch = false; // TODO this should not be hardcoded - Modernizr?
  vm.progress = 0;
  vm.progressEnd = 65;
  vm.description = 'Art is done!';
}];