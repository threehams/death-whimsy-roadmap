'use strict';
var webhooksController = require('../controllers/webhooks-controller');

module.exports = function(router) {
  router.post('/api/webhooks', webhooksController.create);
};