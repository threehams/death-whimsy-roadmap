'use strict';

module.exports = function() {
  var vm = this;
  vm.slide = 0;

  vm.forward = function() {
    if (vm.slide === 4) return;
    if (vm.slideStates[vm.slide]) { vm.slideStates[vm.slide].active = false; }
    vm.slide++;
    if (vm.slideStates[vm.slide]) { vm.slideStates[vm.slide].active = true; }
  };

  vm.back = function() {
    if (vm.slide === 0) return;
    if (vm.slideStates[vm.slide]) { vm.slideStates[vm.slide].active = false; }
    vm.slide--;
    if (vm.slideStates[vm.slide]) { vm.slideStates[vm.slide].active = true; }
  };
};