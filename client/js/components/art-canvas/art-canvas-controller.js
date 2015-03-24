'use strict';

module.exports = ['$timeout', function ($timeout) {
  var vm = this;

  $timeout(function() {
    vm.timelapseSrc = '/img/timelapse.jpg';
  });

}];