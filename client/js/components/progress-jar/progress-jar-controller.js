'use strict';

module.exports = ['$scope', function ($scope) {
  var vm = this;

  $scope.$watch('vm.progress', function(newValue) {
    if (newValue === undefined) return;
    vm.jarsFull = _.range(0, Math.ceil(newValue / 10));
    vm.jarsEmpty = _.range(0, Math.floor((100 - newValue) / 10));
  });
}];