const router = require('express').Router();
const departures = require('./db/departures.js');
const exits = require('./db/exits.js');

router.get('/getDeparturesList/', function(req, res) { departures.getDeparturesList(req, res) });
router.get('/getDepartureById/:id', function(req, res) { departures.getDepartureById(req, res) });
router.post('/logDeparture', function(req, res) { departures.logDeparture(req, res) });

router.get('/getExitsList/', function(req, res) { exits.getExitsList(req, res) });
router.get('/getExitById/:id', function(req, res) { exits.getExitById(req, res) });
router.post('/logExit', function(req, res) { exits.logExit(req, res) });

/**
 * @swagger
 * /api/getDeparturesList:
 *      get:
 *          tags:
 *              - "Departures"
 *          summary: "Wypisuje wszystkie wyjazdy z zajezdni ze szczegółami w formie listy."
 *          operationId: "getDeparturesList"
 *          responses:
 *              "200":
 *                  description: "Lista obiektów JSON"
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  $ref: "#/components/schemas/DepExitDetails"
 *              "500":
 *                  description: "Błąd serwera SQL"
 * /api/getDepartureById/{id}:
 *      get:
 *          tags:
 *              - "Departures"
 *          summary: "Wypisuje wyjazd ze szczegółami, określony przez jego ID."
 *          operationId: "getDepartureById"
 *          parameters:
 *                - name: "id"
 *                  in: "path"
 *                  schema:
 *                      type: integer
 *                  required: true
 *                  description: "Identyfikator wyjazdu"
 *                  example: 1
 *          responses:
 *              "200":
 *                  description: "Obiekt JSON"
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  $ref: "#/components/schemas/DepExitDetails"
 *              "404":
 *                  description: "Nie znaleziono"
 *              "500":
 *                  description: "Błąd serwera SQL"
 * /api/logDeparture:
 *      post:
 *          tags:
 *              - "Departures"
 *          summary: "Ewidencjonuje wyjazd z zajezdni (quasi-orkiestrator)."
 *          description: "Najpierw proces odczytuje potrzebne dane z tabel Brigades (mikroserwis Connections), Buses i Drivers (mikroserwis Resources). Jeśli podane zasoby nie są zajęte, do tabeli Departures dodawany jest rekord z informacjami o wyjeździe z zajezdni. Następnie we wcześniej odczytywanych tabelach zmieniany jest stan zajętości zasobów."
 *          operationId: "logDeparture"
 *          requestBody:
 *              description: "Informacje do ewidencji wyjazdu (w formie obiektu JSON). Wszystkie pola muszą być wypełnione."
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: "#/components/schemas/LogDetails"
 *          responses:
 *              "200":
 *                  description: "Operacja przebiegła pomyślnie"
 *              "400":
 *                  description: "Błąd po stronie klienta"
 *              "500":
 *                  description: "Błąd serwera SQL"
 * /api/getExitsList:
 *  get:
 *      tags:
 *          - "Exits"
 *      summary: "Wypisuje wszystkie zjazdy do zajezdni ze szczegółami w formie listy."
 *      operationId: "getExitsList"
 *      responses:
 *          "200":
 *              description: "Lista obiektów JSON"
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: "#/components/schemas/DepExitDetails"
 *          "500":
 *              description: "Błąd serwera SQL"
 * /api/getExitById/{id}:
 *  get:
 *      tags:
 *          - "Exits"
 *      summary: "Wypisuje zjazd ze szczegółami, określony przez jego ID."
 *      operationId: "getExitById"
 *      parameters:
 *        - name: "id"
 *          in: "path"
 *          schema:
 *              type: integer
 *          required: true
 *          description: "Identyfikator zjazdu"
 *          example: 1
 *      responses:
 *          "200":
 *              description: "Obiekt JSON"
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: "#/components/schemas/DepExitDetails"
 *          "404":
 *              description: "Nie znaleziono"
 *          "500":
 *              description: "Błąd serwera SQL"
 * /api/logExit:
 *  post:
 *      tags:
 *          - "Exits"
 *      summary: "Ewidencjonuje zjazd do zajezdni (quasi-orkiestrator)."
 *      description: "Najpierw proces odczytuje potrzebne dane z tabel Brigades (mikroserwis Connections), Buses i Drivers (mikroserwis Resources). Jeśli podane zasoby są zajęte, do tabeli Exits dodawany jest rekord z informacjami o zjeździe do zajezdni. Następnie we wcześniej odczytywanych tabelach zmieniany jest stan zajętości zasobów."
 *      operationId: "logExit"
 *      requestBody:
 *          description: "Informacje do ewidencji wyjazdu (w formie obiektu JSON). Wszystkie pola muszą być wypełnione."
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/LogDetails"
 *      responses:
 *          "200":
 *              description: "Operacja przebiegła pomyślnie"
 *          "400":
 *              description: "Błąd po stronie klienta"
 *          "500":
 *              description: "Błąd serwera SQL"
*/

module.exports = router;
