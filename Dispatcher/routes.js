const router = require('express').Router();
const departures = require('./db/departures.js');
const exits = require('./db/exits.js');

router.get('/getDeparturesList/', function(req, res) { departures.getDeparturesList(req, res) });
router.get('/getDepartureById/:id', function(req, res) { departures.getDepartureById(req, res) });
router.post('/logDeparture', function(req, res) { departures.logDeparture(req, res) });

router.get('/getExitsList/', function(req, res) { exits.getExitsList(req, res) });
router.get('/getExitById/:id', function(req, res) { exits.getExitById(req, res) });
router.post('/logExit', function(req, res) { exits.logExit(req, res) });

module.exports = router;
