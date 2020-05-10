const pool = require('./pool.js');
const resources = require('./resources.js');
const moment = require('moment');

// Funkcja HTTP GET dla tabeli departures.
var getDeparturesList = function(_request, response) {
    pool.query('SELECT * FROM departures', (err, results) => {
        if (err)
            response.status(400).send(`Error: ${err.message} (${err.code})`);
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
            response.status(400).send(`Error: ${err.message} (${err.code})`);
        else {
            if (results.rows.length == 0) {
                response.sendStatus(404);
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
        brigade, bus_id, driver
    } = request.body;

    // Wstepne wartosci kodu i tresci odpowiedzi HTTP.
    let responseCode = 201;
    let responseMsg = 'OK';

    // Wstepne wartosci statusow zajetosci zasobow.
    let brigadeInSrv = false;
    let busInSrv = false;
    let driverInSrv = false;
    
    // Odczyt wartosci statusow zajetosci zasobow z bazy danych.
    let lastOpFailed = false;

    await resources.getBrigadeInSrvStatus(brigade)
    .then((in_service) => brigadeInSrv = !!in_service)
    .catch((err) => {
        responseCode = 400;
        responseMsg = `${err.message} (SQL code: ${err.code})`;
        lastOpFailed = !lastOpFailed;
    });

    if (!lastOpFailed) {
        await resources.getBusInSrvStatus(bus_id)
        .then((in_service) => busInSrv = !!in_service)
        .catch((err) => {
            responseCode = 400;
            responseMsg = `${err.message} (SQL code: ${err.code})`;
            lastOpFailed = !lastOpFailed;
        });
    }

    if (!lastOpFailed) {
        await resources.getDriverInSrvStatus(driver)
        .then((in_service) => driverInSrv = !!in_service)
        .catch((err) => {
            responseCode = 400;
            responseMsg = `${err.message} (SQL code: ${err.code})`;
            lastOpFailed = !lastOpFailed;
        });
    }
    
    // Sprawdzenie czy wszystkie potrzebne zasoby sa wolne.
    // Wykona się tylko wtedy, jesli po drodze nie wystapil
    // zaden blad podczas odczytu z bazy danych.
    let resourcesFree = false;
    if (!lastOpFailed) {
        if (!brigadeInSrv) {
            if (!busInSrv) {
                if (!driverInSrv) {
                    resourcesFree = !resourcesFree;
                } else {
                    responseCode = 400;
                    responseMsg = "Podany kierowca jest juz obsadzony.";
                }
            } else {
                responseCode = 400;
                responseMsg = "Podany autobus jest juz obsadzony.";
            }
        } else {
            responseCode = 400;
            responseMsg = "Podana brygada jest obsadzona.";
        }
    }

    // Odnotowanie wyjazdu z zajezdni w bazie danych.
    // Wykona sie tylko wtedy, jesli zasoby sa wolne
    // i po drodze nie wystapil zaden blad podczas
    // odczytu z bazy danych.
    if (resourcesFree) {
        await new Promise((resolve, reject) => {
            pool.query('INSERT INTO departures (date, time, brigade, bus_id, driver) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [dateNow.format('YYYY-MM-DD'), dateNow.format('HH:mm:ss'), brigade, bus_id, driver],
            (err, results) => {
                if (err)
                    return reject(err);
    
                resolve(results.rows[0]);
            });
        })
        .then((departure) => {
            responseMsg = `Departure added with ID: ${departure.id})`;
        })
        .catch((err) => {
            responseCode = 400;
            responseMsg = `${err.message} (SQL code: ${err.code})`;
            lastOpFailed = !lastOpFailed;
        });
    }

    // Zmiana statusu zajetosci zasobow uzytych do wyjazdu.
    // Wykona się tylko wtedy, jesli nie wystapil blad
    // podczas zapisu informacji do bazy danych.
    if (!lastOpFailed) {
        brigadeInSrv = !brigadeInSrv;
        busInSrv = !busInSrv;
        driverInSrv = !driverInSrv;

        await resources.updBrigadeInSrvStatus(brigade, brigadeInSrv);
        await resources.updBusInSrvStatus(bus_id, busInSrv);
        await resources.updDriverInSrvStatus(driver, driverInSrv);
    }

    // Wyslanie odpowiedzi HTTP
    response.status(responseCode).send(responseMsg);
}

// Eksport funkcji do uzytku na zewnatrz
exports.getDeparturesList = getDeparturesList;
exports.getDepartureById = getDepartureById;
exports.logDeparture = logDeparture;
