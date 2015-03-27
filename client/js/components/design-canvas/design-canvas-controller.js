'use strict';

module.exports = ['$timeout', function ($timeout) {
  var vm = this;

  $timeout(function() {
    vm.morganSrc = {
      run: '/img/morgan-run.png',
      jump: '/img/morgan-jump.png'
    };
  });

  vm.progress = 0;
  vm.progressEnd = 60;
  vm.description = 'Design is done!';
}];