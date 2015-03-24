'use strict';

module.exports = ['$timeout', function ($timeout) {
  var vm = this;

  vm.currentProgress = 100;

  $timeout(function() {
    vm.morganSrc = {
      run: '/img/morgan-run.png',
      jump: '/img/morgan-jump.png'
    };
  });
}];