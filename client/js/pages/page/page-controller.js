'use strict';

module.exports = ['ProgressService', '$timeout', function (ProgressService, $timeout) {
  var vm = this;

  vm.codeBoxes = _.map(_.range(0, 200), function() {
    if (Math.random() > 0.5) return {color: 'red'};
    return {color: 'green'};
  });
  vm.sprint = { title: 1, endDate: moment().format('MM-DD-YYYY') };
  vm.build = {version: '0.1', title: 'Ephemeral Lagamorph'};
  vm.sprintTitle = 'Sprint #' + vm.sprint.title + ' (ending ' + vm.sprint.endDate + ')';

  function getProgress() {
    ProgressService.index().then(function(data) {
      vm.progress = data;
      $timeout(getProgress, 10000);
    }).catch(function(err) {
      console.log(err);
      $timeout(getProgress, 60000);
    });
  }

  getProgress();
}];
