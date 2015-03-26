'use strict';

module.exports = function() {
  var vm = this;
  vm.slide = vm.slide || 0;
  if (vm.slide !== 0) {
    vm.slides[vm.slide].active = true;
  }

  vm.forward = function() {
    if (vm.slide >= vm.slides.length) return;
    vm.slides[vm.slide].active = false;
    vm.slide++;
    vm.slides[vm.slide].active = true;
  };

  vm.back = function() {
    if (vm.slide <= 0) return;
    vm.slides[vm.slide].active = false;
    vm.slide--;
    vm.slides[vm.slide].active = true;
  };
};