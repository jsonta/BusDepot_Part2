const router = require('express').Router();
const resources = require('./db/resources.js');

const flipBrigade = resources.flipBrigadeInSrvStatus;
const flipBus = resources.flipBusInSrvStatus;

router.get('/flipBusInSrvStatus/:id', function(req, res) { flipBus(req, res) });
router.get('/flipBrigadeInSrvStatus/:id', function(req, res) { flipBrigade(req, res) });

module.exports = router;
