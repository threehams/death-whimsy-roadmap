'use strict';

module.exports = [function () {
  var vm = this;

  vm.codeBoxes = _.map(_.range(0, 200), function() {
    if (Math.random() > 0.5) return {color: 'red'};
    return {color: 'green'};
  });
  vm.sprint = { title: 1, endDate: moment().toDate() };
  vm.build = {version: '0.1', title: 'Ephemeral Lagamorph'};
}];
