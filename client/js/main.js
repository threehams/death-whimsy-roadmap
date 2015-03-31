'use strict';

require('angular');
require('angular-route');
require('angular-animate');
require('angular-messages');
require('angular-touch');
global._ = require('lodash');

var vendor = ['ngRoute', 'ngAnimate', 'ngMessages', 'ngTouch'];
var components = [];
var app = angular.module('DeathWhimsy', vendor.concat(components));

// pages
app.controller('PageController', require('./pages/page/page-controller.js'));

// components (controllers exposed for testing)
app.directive('progressJar', require('./components/progress-jar/progress-jar'));
app.controller('ProgressJarController', require('./components/progress-jar/progress-jar-controller.js'));
app.directive('sectionProgress', require('./components/section-progress/section-progress'));
app.controller('SectionProgressController', require('./components/section-progress/section-progress-controller.js'));

app.directive('designCanvas', require('./components/design-canvas/design-canvas'));
app.controller('DesignCanvasController', require('./components/design-canvas/design-canvas-controller.js'));
app.directive('bugsCanvas', require('./components/bugs-canvas/bugs-canvas'));
app.controller('BugsCanvasController', require('./components/bugs-canvas/bugs-canvas-controller.js'));
app.directive('slideshow', require('./components/slideshow/slideshow'));
app.controller('SlideshowController', require('./components/slideshow/slideshow-controller.js'));
app.directive('artCanvas', require('./components/art-canvas/art-canvas'));
app.controller('ArtCanvasController', require('./components/art-canvas/art-canvas-controller.js'));
app.directive('codeCanvas', require('./components/code-canvas/code-canvas'));
app.controller('CodeCanvasController', require('./components/code-canvas/code-canvas-controller.js'));

// components with no controller
app.directive('autoHeight', require('./components/auto-height/auto-height.js'));

// resources
app.factory('ProgressService', require('./services/progress-service'));
app.factory('Character', require('./services/character-service'));
app.factory('Sprite', require('./services/sprite-service'));
app.factory('DesignSequence', require('./services/design-sequence-service'));
app.factory('ImagePreloader', require('./services/image-preload-service'));

app.config([
  '$locationProvider',
  '$routeProvider',
  function ($locationProvider, $routeProvider) {
    $locationProvider.html5Mode(true);

    $routeProvider
      .when('/', {
        template: require('./pages/page/page-template.jade'),
        controller: 'PageController',
        controllerAs: 'vm'
      })
      .otherwise({
        redirectTo: '/'
      });
  }
]);

// Uncomment for debugging
//angular.module('utils').filter('isDefined', function () {
//  return function (value, msg) {
//    if (value === undefined) {
//      throw new Error('isDefined filter got undefined value ' + msg);
//    }
//    return value;
//  };
//});
