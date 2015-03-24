'use strict';

module.exports = function() {
  return {
    restrict: 'E',
    scope: {
      slideStates: '='
    },
    transclude: true,
    template: require('./slideshow-template.jade'),
    controller: require('./slideshow-controller'),
    controllerAs: 'vm',
    bindToController: true,
    link: function(scope, element) {
      scope.$watch('vm.slide', function(newValue) {
        element[0].querySelector('.slideshow-container').style['margin-left'] = (newValue * -100).toString() + '%';

        if (newValue === 0) {
          element[0].querySelector('.slideshow-arrow-left').classList.remove('enabled');
        } else if (newValue === 4) {
          element[0].querySelector('.slideshow-arrow-right').classList.remove('enabled');
        } else {
          element[0].querySelector('.slideshow-arrow-left').classList.add('enabled');
          element[0].querySelector('.slideshow-arrow-right').classList.add('enabled');
        }
      });
    }
  };
};