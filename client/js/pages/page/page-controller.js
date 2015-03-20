'use strict';

module.exports = ['ProgressService', '$timeout', '$filter', function (ProgressService, $timeout, $filter) {
  var vm = this;

  vm.codeBoxes = _.map(_.range(0, 200), function() {
    if (Math.random() > 0.5) return {color: 'red'};
    return {color: 'green'};
  });

  function getProgress() {
    ProgressService.index().then(function(data) {
      vm.progress = data.progress;
      vm.sprint = data.sprint;
      vm.sprint.formattedTitle = vm.sprint.title +
        ' (' + $filter('date')(vm.sprint.startDate, 'shortDate') + ' - ' +
        $filter('date')(vm.sprint.endDate, 'shortDate') + ')';
      console.dir(vm.sprint);
      $timeout(getProgress, 2000);
    }).catch(function(err) {
      console.log(err);
      $timeout(getProgress, 60000);
    });
  }

  getProgress();
}];
