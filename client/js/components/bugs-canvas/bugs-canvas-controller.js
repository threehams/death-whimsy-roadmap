'use strict';

module.exports = ['$timeout', function ($timeout) {
  var vm = this;

  $timeout(function() {
    vm.bugsSrc = '/img/bugs-2.jpg';
  });

}];