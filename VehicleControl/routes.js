const router = require('express').Router();
const persons = require('./db/persons.js');
const vehicles = require('./db/vehicles.js');
const results = require('./db/results.js');

router.get('/getPersonsList/', function(req, res) { persons.getPersonsList(req, res) });
router.get('/getPersonById/:id', function(req, res) { persons.getPersonById(req, res) });
router.post('/postPerson', function(req, res) { persons.postPerson(req, res) });
router.put('/updatePerson/:id', function(req, res) { persons.updatePerson(req, res) });
router.delete('/deletePerson/:id', function(req, res) { persons.deletePerson(req, res) });

router.get('/getVehiclesList/', function(req, res) { vehicles.getVehiclesList(req, res) });
router.get('/getVehicleById/:id', function(req, res) { vehicles.getVehicleById(req, res) });
router.post('/postVehicle', function(req, res) { vehicles.postVehicle(req, res) });
router.put('/updateVehicle/:id', function(req, res) { vehicles.updateVehicle(req, res) });
router.delete('/deleteVehicle/:id', function(req, res) { vehicles.deleteVehicle(req, res) });

router.get('/getResultsList/', function(req, res) { results.getResultsList(req, res) });
router.get('/getResultById/:id', function(req, res) { results.getResultById(req, res) });
router.post('/postResult', function(req, res) { results.postResult(req, res) });
router.put('/updateResult/:id', function(req, res) { results.updateResult(req, res) });
router.delete('/deleteResult/:id', function(req, res) { results.deleteResult(req, res) });

module.exports = router;
