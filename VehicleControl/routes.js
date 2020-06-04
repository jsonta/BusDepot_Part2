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

/**
 * @swagger
 * /vehiclecontrol/getPersonsList:
 *  get:
 *      tags:
 *          - "Persons"
 *      summary: "Wypisuje wszystkie osoby ze szczegółami, które dotychczas zleciły kontrolę pojazdu, w formie listy."
 *      operationId: "getPersonsList"
 *      responses:
 *          "200":
 *              description: "Lista obiektów JSON"
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: "#/components/schemas/Person"
 *          "500":
 *              description: "Błąd serwera SQL"
 * /vehiclecontrol/getPersonById/{id}:
 *  get:
 *      tags:
 *          - "Persons"
 *      summary: "Wypisuje osobę ze szczegółami, która dotychczas zleciła kontrolę pojazdu, określoną przez jej ID."
 *      operationId: "getPersonById"
 *      parameters:
 *        - name: "id"
 *          in: "path"
 *          schema:
 *              type: integer
 *          required: true
 *          description: "Numer PESEL osoby zlecającej kontrolę pojazdu"
 *          example: 99123100000
 *      responses:
 *          "200":
 *              description: "Obiekt JSON"
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: "#/components/schemas/Person"
 *          "404":
 *              description: "Nie znaleziono"
 *          "500":
 *              description: "Błąd serwera SQL"
 * /vehiclecontrol/postPerson:
 *  post:
 *      tags:
 *          - "Persons"
 *      summary: "Dodaje nową osobę zlecającą kontrolę pojazdu do spisu osób (bazy danych)."
 *      operationId: "postPerson"
 *      requestBody:
 *          description: "Dane osobowe zleceniodawcy (w formie obiektu JSON). Wszystkie muszą być wypełnione, o ile nie zaznaczono inaczej."
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/Person"
 *      responses:
 *          "201":
 *              description: "Utworzono pomyślnie"
 *          "500":
 *              description: "Błąd serwera SQL"
 * /vehiclecontrol/updatePerson/{id}:
 *  put:
 *      tags:
 *          - "Persons"
 *      summary: "Aktualizuje dane osoby zlecającej kontrolę pojazdu, określoną przez jej ID."
 *      operationId: "putPerson"
 *      parameters:
 *        - name: "id"
 *          in: "path"
 *          schema:
 *              type: integer
 *          required: true
 *          description: "Numer PESEL osoby zlecającej kontrolę pojazdu"
 *          example: 99123100000
 *      requestBody:
 *          description: "Parametry, jakie mają zostać zaktualizowane (w formie obiektu JSON). Wystarczy podać tylko nowe wartości - pozostałe zostaną skopiowane."
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/Person"
 *      responses:
 *          "200":
 *              description: "Operacja ukończona pomyślnie"
 *          "404":
 *              description: "Nie znaleziono"
 *          "500":
 *              description: "Błąd serwera SQL"
 * /vehiclecontrol/deletePerson/{id}:
 *  delete:
 *      tags:
 *          - "Persons"
 *      summary: "Usuwa osobę zlecającą kontrolę pojazdu ze spisu osób (bazy danych)."
 *      operationId: "deletePerson"
 *      parameters:
 *        - name: "id"
 *          in: "path"
 *          schema:
 *              type: integer
 *          required: true
 *          description: "Numer PESEL osoby zlecającej kontrolę pojazdu"
 *          example: 9912310000
 *      responses:
 *          "200":
 *              description: "Operacja ukończona pomyślnie"
 *          "404":
 *              description: "Nie znaleziono"
 *          "500":
 *              description: "Błąd serwera SQL"
 * 
 * /vehiclecontrol/getResultsList:
 *  get:
 *      tags:
 *          - "Results"
 *      summary: "Wypisuje wszystkie wyniki kontroli pojazdów ze szczegółami, w formie listy."
 *      operationId: "getResultsList"
 *      responses:
 *          "200":
 *              description: "Lista obiektów JSON"
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: "#/components/schemas/Result"
 *          "500":
 *              description: "Błąd serwera SQL"
 * /vehiclecontrol/getResultsById/{id}:
 *  get:
 *      tags:
 *          - "Results"
 *      summary: "Wypisuje wynik kontroli pojazdu ze szczegółami, określony przez jego ID."
 *      operationId: "getResultsById"
 *      parameters:
 *        - name: "id"
 *          in: "path"
 *          schema:
 *              type: integer
 *          required: true
 *          description: "Identyfikator wyniku kontroli"
 *          example: 1
 *      responses:
 *          "200":
 *              description: "Obiekt JSON"
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: "#/components/schemas/Result"
 *          "404":
 *              description: "Nie znaleziono"
 *          "500":
 *              description: "Błąd serwera SQL"
 * /vehiclecontrol/postResult:
 *  post:
 *      tags:
 *          - "Results"
 *      summary: "Dodaje nowy wynik kontroli pojazdu do ewidencji (bazy danych)."
 *      operationId: "postResults"
 *      requestBody:
 *          description: "Informacje do ewidencji kontroli pojazdu (w formie obiektu JSON). Wszystkie pola muszą być wypełnione."
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/Result"
 *      responses:
 *          "201":
 *              description: "Utworzono pomyślnie"
 *          "500":
 *              description: "Błąd serwera SQL"
 * /vehiclecontrol/updateResult/{id}:
 *  put:
 *      tags:
 *          - "Results"
 *      summary: "Aktualizuje wynik kontroli pojazdu, określony przez jego ID."
 *      operationId: "putResults"
 *      parameters:
 *        - name: "id"
 *          in: "path"
 *          schema:
 *              type: integer
 *          required: true
 *          description: "Identyfikator wyniku kontroli pojazdu"
 *          example: 1
 *      requestBody:
 *          description: "Parametry, jakie mają zostać zaktualizowane (w formie obiektu JSON). Wystarczy podać tylko nowe wartości - pozostałe zostaną skopiowane."
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/Vehicle"
 *      responses:
 *          "200":
 *              description: "Operacja ukończona pomyślnie"
 *          "404":
 *              description: "Nie znaleziono"
 *          "500":
 *              description: "Błąd serwera SQL"
 * /vehiclecontrol/deleteResult/{id}:
 *  delete:
 *      tags:
 *          - "Results"
 *      summary: "Usuwa wynik kontroli pojazdu z ewidencji (bazy danych)."
 *      operationId: "deleteResult"
 *      parameters:
 *        - name: "id"
 *          in: "path"
 *          schema:
 *              type: integer
 *          required: true
 *          description: "Identyfikator wyniku kontroli pojazdu"
 *          example: 1
 *      responses:
 *          "200":
 *              description: "Operacja ukończona pomyślnie"
 *          "404":
 *              description: "Nie znaleziono"
 *          "500":
 *              description: "Błąd serwera SQL"
 * 
 * /vehiclecontrol/getVehiclesList:
 *  get:
 *      tags:
 *          - "Vehicles"
 *      summary: "Wypisuje wszystkie dotychczas skontrolowane pojazdy, w formie listy."
 *      operationId: "getVehiclesList"
 *      responses:
 *          "200":
 *              description: "Lista obiektów JSON"
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: "#/components/schemas/Vehicle"
 *          "500":
 *              description: "Błąd serwera SQL"
 * /vehiclecontrol/getVehicleById/{id}:
 *  get:
 *      tags:
 *          - "Vehicles"
 *      summary: "Wypisuje dotychczas skontrolowany pojazd, określony przez jego ID."
 *      operationId: "getVehicleById"
 *      parameters:
 *        - name: "id"
 *          in: "path"
 *          schema:
 *              type: integer
 *          required: true
 *          description: "Identyfikator pojazdu"
 *          example: 1
 *      responses:
 *          "200":
 *              description: "Obiekt JSON"
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: "#/components/schemas/Vehicle"
 *          "404":
 *              description: "Nie znaleziono"
 *          "500":
 *              description: "Błąd serwera SQL"
 * /vehiclecontrol/postVehicle:
 *  post:
 *      tags:
 *          - "Vehicles"
 *      summary: "Dodaje nowy skontrolowany pojazd do spisu pojazdów (bazy danych)."
 *      operationId: "postVehicle"
 *      requestBody:
 *          description: "Dane techniczne pojazdu (w formie obiektu JSON). Wszystkie pola muszą być wypełnione."
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/Vehicle"
 *      responses:
 *          "201":
 *              description: "Dodano pomyślnie"
 *          "500":
 *              description: "Błąd serwera SQL"
 * /vehiclecontrol/updateVehicle/{id}:
 *  put:
 *      tags:
 *          - "Vehicles"
 *      summary: "Aktualizuje dane skontrolowanego pojazdu, określonego przez jego ID."
 *      operationId: "putVehicle"
 *      parameters:
 *        - name: "id"
 *          in: "path"
 *          schema:
 *              type: integer
 *          required: true
 *          description: "Identyfikator pojazdu"
 *          example: 1
 *      requestBody:
 *          description: "Parametry, jakie mają zostać zaktualizowane (w formie obiektu JSON). Wystarczy podać tylko nowe wartości - pozostałe zostaną skopiowane."
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/Vehicle"
 *      responses:
 *          "200":
 *              description: "Operacja ukończona pomyślnie"
 *          "404":
 *              description: "Nie znaleziono"
 *          "500":
 *              description: "Błąd serwera SQL"
 * /vehiclecontrol/deleteVehicle/{id}:
 *  delete:
 *      tags:
 *          - "Vehicles"
 *      summary: "Usuwa skontrolowany pojazd ze spisu pojazdów (bazy danych)."
 *      operationId: "deleteVehicle"
 *      parameters:
 *        - name: "id"
 *          in: "path"
 *          schema:
 *              type: integer
 *          required: true
 *          description: "Identyfikator pojazdu"
 *          example: 1
 *      responses:
 *          "200":
 *              description: "Operacja ukończona pomyślnie"
 *          "404":
 *              description: "Nie znaleziono"
 *          "500":
 *              description: "Błąd serwera SQL"
 */

module.exports = router;
