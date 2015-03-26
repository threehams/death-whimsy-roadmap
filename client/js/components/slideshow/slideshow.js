'use strict';

module.exports = function() {
  return {
    restrict: 'E',
    scope: {
      slides: '=',
      slide: '='
    },
    transclude: true,
    template: require('./slideshow-template.jade'),
    controller: require('./slideshow-controller'),
    controllerAs: 'vm',
    bindToController: true,
    link: function(scope, element) {
      scope.$watch('vm.slide', function(newValue) {
        if (newValue === undefined) return;

        element[0].querySelector('.slideshow-container').style['margin-left'] = (newValue * -100).toString() + '%';

        if (newValue === 0) {
          element[0].querySelector('.slideshow-arrow-left').classList.remove('enabled');
          element[0].querySelector('.slideshow-arrow-right').classList.add('enabled');
        } else if (newValue === scope.vm.slides.length - 1) {
          element[0].querySelector('.slideshow-arrow-left').classList.add('enabled');
          element[0].querySelector('.slideshow-arrow-right').classList.remove('enabled');
        } else {
          element[0].querySelector('.slideshow-arrow-left').classList.add('enabled');
          element[0].querySelector('.slideshow-arrow-right').classList.add('enabled');
        }
      });
    }
  };
};