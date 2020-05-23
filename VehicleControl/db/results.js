const pool = require('./pool.js');
const moment = require('moment');

// Funkcja HTTP GET dla tabeli vc_results.
var getResultsList = function(_request, response) {
    pool.query('SELECT * FROM vc_results', (err, results) => {
        if (err)
            response.status(500).send(`Error: ${err.message} (${err.code})`);
        else
            response.status(200).json(results.rows);
    });
}

// Funkcja HTTP GET dla tabeli vc_results,
// z ID okreslonym w parametrach zadania HTTP.
var getResultById = function(request, response) {
    let id = parseInt(request.params.id);
    pool.query('SELECT * FROM vc_results WHERE id = $1', [id], (err, results) => {
        if (err)
            response.status(500).send(`Error: ${err.message} (${err.code})`);
        else {
            if (results.rows.length == 0) {
                response.status(404).send("Nie znaleziono");
            } else {
                response.status(200).json(results.rows[0]);
            }
        }
    });
}

// Funkcja HTTP POST dla tabeli vc_results.
var postResult = function(request, response) {
    let dateNow = moment();
    let {
        car_id, brkds_front_test, brkpd_front_test, brkds_rear_test, brkpd_rear_test, brkdrum_test
    } = request.body;

    pool.query('INSERT INTO vc_results (car_id, cntl_date, cntl_time, brkds_front_test, brkpd_front_test, brkds_rear_test, brkpd_rear_test, brkdrum_test) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
    [car_id, dateNow.format('YYYY-MM-DD'), dateNow.format('HH:mm:ss'), brkds_front_test, brkpd_front_test, brkds_rear_test, brkpd_rear_test, brkdrum_test],
    (err, results) => {
        if (err)
            response.status(500).send(`Error: ${err.message} (${err.code})`);
        else
            response.status(201).send(`Dodano nowy wynik kontroli o ID nr ${results.rows[0].id}.`);
    });
}

// Funkcja HTTP PUT dla tabeli vc_results,
// z ID okreslonym w parametrach zadania HTTP.
var updateResult = async function(request, response) {
    // Odczyt danych z przeslanego zadania HTTP.
    let id = parseInt(request.params.id);
    let {
        brkds_front_test, brkpd_front_test, brkds_rear_test, brkpd_rear_test, brkdrum_test
    } = request.body;

    // Wstepne wartosci kodu i tresci odpowiedzi HTTP.
    let responseCode = 200;
    let responseMsg = `Szczegóły wyniku kontroli o ID nr ${id} zostały zaktualizowane.`;

    // Odczyt wpisu o podanym ID z bazy danych celem uzupelnienia
    // brakujacych danych wymaganych dla kwerendy UPDATE.
    let lastOpFailed = false;

    await new Promise((resolve, reject) => {
        pool.query('SELECT * FROM vc_results WHERE id = $1', [id], (err, results) => {
            if (err)
                return reject(err);

            resolve(results.rows);
        });
    })
    .then((result) => {
        if (result.length != 0) {
            if (brkds_front_test == undefined)
                brkds_front_test = result[0].brkds_front_test;

            if (brkds_rear_test == undefined)
                brkds_rear_test = result[0].brkds_rear_test;

            if (brkpd_front_test == undefined)
                brkpd_front_test = result[0].brkpd_front_test;

            if (brkpd_rear_test == undefined)
                brkpd_rear_test = result[0].brkpd_rear_test;

            if (brkdrum_test == undefined)
                brkdrum_test = result[0].brkdrum_test;
        } else {
            responseCode = 404;
            responseMsg = `Nie znaleziono`;
            lastOpFailed = !lastOpFailed;
        }
    })
    .catch((err) => {
        responseCode = 500;
        responseMsg = `Error: ${err.message} (${err.code})`;
        lastOpFailed = !lastOpFailed;
    });

    // Aktualizacja wpisu w bazie danych.
    // Wykona się tylko wtedy, jesli po drodze nie wystapil
    // zaden blad podczas odczytu z bazy danych.
    if (!lastOpFailed) {
        await new Promise((resolve, reject) => {
            pool.query('UPDATE vc_results SET brkds_front_test = $2, brkds_rear_test = $3, brkpd_front_test = $4, brkpd_rear_test = $5, brkdrum_test = $6 WHERE id = $1',
            [id, brkds_front_test, brkds_rear_test, brkpd_front_test, brkpd_rear_test, brkdrum_test],
            (err, results) => {
                if (err)
                    return reject(err);

                resolve(results);
            });
        })
        .catch((err) => {
            responseCode = 500;
            responseMsg = `Error: ${err.message} (${err.code})`;
        });
    }

    // Wyslanie odpowiedzi HTTP
    response.status(responseCode).send(responseMsg);
}

// Funkcja HTTP DELETE dla tabeli vc_results,
// z ID okreslonym w parametrach zadania HTTP.
var deleteResult = function (request, response) {
    let id = parseInt(request.params.id);

    pool.query('DELETE FROM vc_results WHERE id = $1', [id], (err, _results) => {
        if (err)
            response.status(500).send(`Error: ${err.message} (${err.code})`);
        else
            response.status(200).send(`Wynik kontroli o ID nr ${id} został usunięty.`);
    });
}

// Eksport funkcji do uzytku na zewnatrz
exports.getResultsList = getResultsList;
exports.getResultById = getResultById;
exports.postResult = postResult;
exports.updateResult = updateResult;
exports.deleteResult = deleteResult;
