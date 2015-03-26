'use strict';

module.exports = ['$q', function($q) {
  return {
    load: function(src) {
      var defer = $q.defer();
      var image = new Image();

      image.onload = function() {
        defer.resolve(image);
      };
      image.src = src;

      return defer.promise;
    }
  };
}];