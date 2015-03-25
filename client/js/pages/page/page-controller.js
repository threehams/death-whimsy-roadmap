'use strict';

module.exports = ['ProgressService', '$timeout', function (ProgressService, $timeout) {
  var vm = this;

  vm.slide = 0;
  vm.getProgress = function() {
    ProgressService.index().then(function(data) {
      vm.progress = data.progress;
      $timeout(vm.getProgress, 2000);
    }).catch(function(err) {
      console.log(err);
      $timeout(vm.getProgress, 60000);
    });
  };

  vm.getProgress();
  vm.slides = [
    {},
    {},
    {},
    {},
    {}
  ];
}];
