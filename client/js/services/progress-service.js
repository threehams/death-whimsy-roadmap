'use strict';

var ProgressService = function($http) {
  return {
    index: function() {
      return $http.get('/api/progress').then(function(response) {
        return response.data;
      });
    }
  };
};

ProgressService.$inject = ['$http'];

module.exports = ProgressService;