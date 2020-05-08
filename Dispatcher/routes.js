const router = require('express').Router();
const resources = require('./db/resources.js');

const readBrigade = resources.readBrigadeInSrvStatus;
const readBus = resources.readBusInSrvStatus;
const readDriver = resources.readDriverInSrvStatus;
const flipBrigade = resources.flipBrigadeInSrvStatus;
const flipBus = resources.flipBusInSrvStatus;
const flipDriver = resources.flipDriverInSrvStatus;

router.get('/readBrigadeInSrvStatus/:id', function(req, res) { readBrigade(req, res) });
router.get('/readBusInSrvStatus/:id', function(req, res) { readBus(req, res) });
router.get('/readDriverInSrvStatus/:id', function(req, res) { readDriver(req, res) });
router.get('/flipBrigadeInSrvStatus/:id', function(req, res) { flipBrigade(req, res) });
router.get('/flipBusInSrvStatus/:id', function(req, res) { flipBus(req, res) });
router.get('/flipDriverInSrvStatus/:id', function(req, res) { flipDriver(req, res) });

module.exports = router;
