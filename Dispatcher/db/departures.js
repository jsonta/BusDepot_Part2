const pool = require('./pool.js');
const resources = require('./resources.js');
const moment = require('moment');

// Funkcja HTTP GET dla tabeli departures.
var getDeparturesList = function(_request, response) {
    pool.query('SELECT * FROM departures', (err, results) => {
        if (err)
            response.status(500).send(`Błąd serwera SQL - ${err.message} (kod ${err.code}).`);
        else
            response.status(200).json(results.rows);
    });
}

// Funkcja HTTP GET dla tabeli departures,
// z ID okreslonym w parametrach zadania HTTP.
var getDepartureById = function(request, response) {
    let id = parseInt(request.params.id);
    pool.query('SELECT * FROM departures WHERE id = $1', [id], (err, results) => {
        if (err)
            response.status(500).send(`Błąd serwera SQL - ${err.message} (kod ${err.code}).`);
        else {
            if (results.rows.length == 0) {
                response.status(404).send("Nie znaleziono");
            } else {
                response.status(200).json(results.rows[0]);
            }
        }
    });
}

// Funkcja HTTP POST dla tabeli departures
// - odnotowanie wyjazdu z zajezdni.
var logDeparture = async function (request, response) {
    // Odczyt danych z ciala przeslanego zadania HTTP.
    let {
        brigade, bus, driver
    } = request.body;

    // Wstepne wartosci statusow zajetosci zasobow.
    let brigadeInSrv = false;
    let busInSrv = false;
    let driverInSrv = false;
    
    // Odczyt wartosci statusow zajetosci zasobow z bazy danych.
    await resources.getBrigadeInSrvStatus(brigade)
    .then((in_service) => brigadeInSrv = !!in_service)
    .catch((err) => {
        if (err.code == 404) {
            response.status(404).send(err.message);
            return;
        } else {
            response.status(500).send(`Błąd serwera SQL - ${err.message} (kod ${err.code}).`);
            return;
        }
    });

    await resources.getBusInSrvStatus(bus)
    .then((in_service) => busInSrv = !!in_service)
    .catch((err) => {
        if (err.code == 404) {
            response.status(404).send(err.message);
            return;
        } else {
            response.status(500).send(`Błąd serwera SQL - ${err.message} (kod ${err.code}).`);
            return;
        }
    });

    await resources.getDriverInSrvStatus(driver)
    .then((in_service) => driverInSrv = !!in_service)
    .catch((err) => {
        if (err.code == 404) {
            response.status(404).send(err.message);
            return;
        } else {
            response.status(500).send(`Błąd serwera SQL - ${err.message} (kod ${err.code}).`);
            return;
        }
    });
    
    // Sprawdzenie czy wszystkie potrzebne zasoby sa wolne.
    // Wykona się tylko wtedy, jesli po drodze nie wystapil
    // zaden blad podczas odczytu z bazy danych.
    if (brigadeInSrv) {
        response.status(400).send("Podana brygada jest obsadzona.");
        return;
    } else if (busInSrv) {
        response.status(400).send("Podany autobus jest juz obsadzony.");
        return;
    } else if (driverInSrv) {
        response.status(400).send("Podany kierowca jest juz obsadzony.");
        return;
    }

    // Odnotowanie wyjazdu z zajezdni w bazie danych.
    // Wykona sie tylko wtedy, jesli zasoby sa wolne
    // i po drodze nie wystapil zaden blad podczas
    // odczytu z bazy danych.
    let dateNow = moment();
    await new Promise((resolve, reject) => {
        pool.query('INSERT INTO departures (date, time, brigade, bus, driver) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [dateNow.format('YYYY-MM-DD'), dateNow.format('HH:mm:ss'), brigade, bus, driver],
        (err, results) => {
            if (err)
                return reject(err);
    
            resolve(results.rows[0]);
        });
    })
    .then((departure) => response.status(200).send(`Wyjazd z zajezdni o ID nr ${departure.id} został wyewidencjonowany.`))
    .catch((err) => {
        response.status(500).send(`Błąd serwera SQL - ${err.message} (kod ${err.code}).`);
        return;
    });

    // Zmiana statusu zajetosci zasobow uzytych do wyjazdu.
    // Wykona się tylko wtedy, jesli nie wystapil blad
    // podczas zapisu informacji do bazy danych.
    brigadeInSrv = !brigadeInSrv;
    busInSrv = !busInSrv;
    driverInSrv = !driverInSrv;

    await resources.updBrigadeInSrvStatus(brigade, brigadeInSrv);
    await resources.updBusInSrvStatus(bus, busInSrv);
    await resources.updDriverInSrvStatus(driver, driverInSrv);
}

// Eksport funkcji do uzytku na zewnatrz
exports.getDeparturesList = getDeparturesList;
exports.getDepartureById = getDepartureById;
exports.logDeparture = logDeparture;
