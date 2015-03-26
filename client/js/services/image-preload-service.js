'use strict';

module.exports = ['$q', function($q) {
  return {
    load: function(src) {
      return $q(function(resolve, reject) {
        var image = new Image();

        image.onload = function() {
          resolve(image);
        };
        image.src = src;
      });
    }
  };
}];