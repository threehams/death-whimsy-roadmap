'use strict';
var webhooksController = require('../controllers/webhooks-controller');

module.exports = function(router) {
  router.get('/api/webhooks', webhooksController.index);
  router.post('/api/webhooks', webhooksController.create);
};