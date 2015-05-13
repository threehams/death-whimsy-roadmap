'use strict';

module.exports = ['ProgressService', '$location', function (ProgressService, $location) {
  var vm = this;

  vm.slide = 0;
  vm.getProgress = function() {
    ProgressService.index().then(function(data) {
      vm.epics = data.epics;
      if ($location.search().progress) {
        vm.fakeProgress = parseInt($location.search().progress);
        vm.totalProgress = {
          art: vm.fakeProgress,
          code: vm.fakeProgress,
          design: vm.fakeProgress
        };
      } else {
        vm.totalProgress = data.total;
      }
      //$timeout(vm.getProgress, 2000);
    }).catch(function(err) {
      console.log(err);
      //$timeout(vm.getProgress, 60000);
    });
  };

  vm.incrementProgress = function(progress) {
    $location.path('/').search({progress: progress});
  };

  vm.getProgress();
  vm.slides = [
    {},
    {},
    {},
    {}
  ];
}];
