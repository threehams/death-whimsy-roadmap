'use strict';

module.exports = ['ProgressService', '$timeout', '$filter', function (ProgressService, $timeout, $filter) {
  var vm = this;

  vm.slide = 0;

  function getProgress() {
    ProgressService.index().then(function(data) {
      vm.progress = data.progress;
      vm.sprint = data.sprint;
      vm.sprint.formattedTitle = vm.sprint.title +
        ' (' + $filter('date')(vm.sprint.startDate, 'shortDate') + ' - ' +
        $filter('date')(vm.sprint.endDate, 'shortDate') + ')';
      $timeout(getProgress, 2000);
    }).catch(function(err) {
      console.log(err);
      $timeout(getProgress, 60000);
    });
  }

  vm.forward = function() {
    if (vm.slide === 4) return;
    vm.slide++;
    document.querySelector('.slideshow-container').style['margin-left'] = (vm.slide * -100).toString() + '%';
  };

  vm.back = function() {
    if (vm.slide === 0) return;
    vm.slide--;
    document.querySelector('.slideshow-container').style['margin-left'] = (vm.slide * -100).toString() + '%';
  };

  getProgress();
}];
