'use strict';

module.exports = [function () {
  var vm = this;

  vm.currentProgress = 45;

  vm.src = {
    jar: '/img/timelapse.jpg',
    icons: '/img/code-icons.png'
  };

  vm.touch = false; // TODO this should not be hardcoded - Modernizr?
  vm.progress = 0;
}];