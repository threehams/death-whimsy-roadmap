'use strict';
var progressController = require('../controllers/progress-controller');

module.exports = function(router) {
  router.get('/api/progress', progressController.index);
};