'use strict';

module.exports = function () {
  var vm = this;

  vm.current = function() {
    return vm.progress * (vm.progressEnd / 100);
  };
};