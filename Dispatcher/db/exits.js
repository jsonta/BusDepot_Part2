const pool = require('./pool.js');
const resources = require('./resources.js');
const moment = require('moment');

// Funkcja HTTP GET dla tabeli exits.
var getExitsList = function(_request, response) {
    pool.query('SELECT * FROM exits', (err, results) => {
        if (err) {
            let errNo = parseInt(err.errno);

            if (errNo >= 400) {
                response.status(errNo)
                    .send("Error: "+err.code+" ("+errNo+")");
            } else {
                response.status(400)
                    .send("Error: "+err.code+" ("+errNo+")");
            }
        } else {
            response.status(200).json(results.rows);
        }
    });
}

// Funkcja HTTP GET dla tabeli exits,
// z ID okreslonym w parametrach zadania HTTP.
var getExitById = function(request, response) {
    let id = parseInt(request.params.id);
    pool.query('SELECT * FROM exits WHERE id = $1', [id], (err, results) => {
        if (err) {
            let errNo = parseInt(err.errno);

            if (errNo >= 400) {
                response.status(errNo)
                    .send("Error: "+err.code+" ("+errNo+")");
            } else {
                response.status(400)
                    .send("Error: "+err.code+" ("+errNo+")");
            }
        } else {
            response.status(200).json(results.rows);
        }
    });
}

// Funkcja HTTP POST (wewnetrzna) dla tabeli exits.
var postExit = function(brigade, bus_id, driver) {
    let dateNow = moment();
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO exits (date, time, brigade, bus_id, driver) VALUES ($1, $2, $3, $4, $5)',
        [dateNow.format('YYYY-MM-DD'), dateNow.format('HH:mm:ss'), brigade, bus_id, driver],
        (err, results) => {
            if (err) {
                return reject(err);
            }

            resolve(results);
        });
    });
}

// Funkcja HTTP POST dla tabeli exits
// - odnotowanie zjazdu do zajezdni.
var logExit = async function (request, response) {
    // Odczyt danych z ciala przeslanego zadania HTTP.
    let {
        brigade, bus_id, driver
    } = request.body;

    // Wstepne wartosci kodu i tresci odpowiedzi HTTP.
    let responseCode = 201;
    let responseMsg = 'OK';

    // Wstepne wartosci statusow zajetosci zasobow.
    let brigadeInSrv = true;
    let busInSrv = true;
    let driverInSrv = true;
    
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
    let resourcesBusy = true;
    if (!lastOpFailed) {
        if (brigadeInSrv) {
            if (busInSrv) {
                if (driverInSrv) {
                    resourcesBusy = !resourcesBusy;
                } else {
                    responseCode = 400;
                    responseMsg = "Podany kierowca nie jest nigdzie obsadzony.";
                }
            } else {
                responseCode = 400;
                responseMsg = "Podany autobus nie jest nigdzie obsadzony.";
            }
        } else {
            responseCode = 400;
            responseMsg = "Podana brygada nie jest obsadzona.";
        }
    }

    // Odnotowanie zjazdu do zajezdni w bazie danych.
    // Wykona sie tylko wtedy, jesli zasoby sa zajete
    // i po drodze nie wystapil zaden blad podczas
    // odczytu z bazy danych.
    let exitLogged = false;
    if (!resourcesBusy) {
        await postExit(brigade, bus_id, driver)
        .then(() => {
            exitLogged = !exitLogged;
            brigadeInSrv = !brigadeInSrv;
            busInSrv = !busInSrv;
            driverInSrv = !driverInSrv;
        })
        .catch((err) => {
            responseCode = 400;
            responseMsg = `${err.message} (SQL code: ${err.code})`;
        });
    }

    // Zmiana statusu zajetosci zasobow uzytych do wyjazdu.
    // Wykona się tylko wtedy, jesli nie wystapil blad
    // podczas zapisu informacji do bazy danych.
    if (exitLogged) {
        await resources.updBrigadeInSrvStatus(brigade, brigadeInSrv)
        .catch((err) => {
            responseCode = 400;
            responseMsg = `${err.message} (SQL code: ${err.code})`;
            lastOpFailed = !lastOpFailed;
        });

        if (!lastOpFailed) {
            await resources.updBusInSrvStatus(bus_id, busInSrv)
            .catch((err) => {
                responseCode = 400;
                responseMsg = `${err.message} (SQL code: ${err.code})`;
                lastOpFailed = !lastOpFailed;
            });
        }

        if (!lastOpFailed) {
            await resources.updDriverInSrvStatus(driver, driverInSrv)
            .catch((err) => {
                responseCode = 400;
                responseMsg = `${err.message} (SQL code: ${err.code})`;
            });
        }
    }

    // Wyslanie odpowiedzi HTTP
    response.status(responseCode).send(responseMsg);
}

// Eksport funkcji do uzytku na zewnatrz
exports.getExitsList = getExitsList;
exports.getExitById = getExitById;
exports.logExit = logExit;
