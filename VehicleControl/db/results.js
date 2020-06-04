const pool = require('./pool.js');
const moment = require('moment');

// Funkcja HTTP GET dla tabeli vc_results.
var getResultsList = function(_request, response) {
    pool.query('SELECT * FROM vc_results', (err, results) => {
        if (err)
            response.status(500).send(`Błąd serwera SQL - ${err.message} (kod ${err.code}).`);
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
            response.status(500).send(`Błąd serwera SQL - ${err.message} (kod ${err.code}).`);
        else {
            if (results.rows.length == 0)
                response.status(404).send("Nie znaleziono");
            else
                response.status(200).json(results.rows[0]);
        }
    });
}

// Funkcja HTTP POST dla tabeli vc_results.
var postResult = function(request, response) {
    let dateNow = moment();
    let {
        car, person, brkds_front_test, brkpd_front_test, brkds_rear_test, brkpd_rear_test, brkdrum_test
    } = request.body;

    pool.query('INSERT INTO vc_results (car, person, cntl_date, cntl_time, brkds_front_test, brkpd_front_test, brkds_rear_test, brkpd_rear_test, brkdrum_test) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
    [car, person, dateNow.format('YYYY-MM-DD'), dateNow.format('HH:mm:ss'), brkds_front_test, brkpd_front_test, brkds_rear_test, brkpd_rear_test, brkdrum_test],
    (err, results) => {
        if (err)
            response.status(500).send(`Błąd serwera SQL - ${err.message} (kod ${err.code}).`);
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
            response.status(404).send("Nie znaleziono");
            return;
        }
    })
    .catch((err) => {
        response.status(500).send(`Błąd serwera SQL - ${err.message} (kod ${err.code}).`);
        return;
    });

    // Aktualizacja wpisu w bazie danych.
    // Wykona się tylko wtedy, jesli po drodze nie wystapil
    // zaden blad podczas odczytu z bazy danych.
    await new Promise((resolve, reject) => {
        pool.query('UPDATE vc_results SET brkds_front_test = $2, brkds_rear_test = $3, brkpd_front_test = $4, brkpd_rear_test = $5, brkdrum_test = $6 WHERE id = $1',
        [id, brkds_front_test, brkds_rear_test, brkpd_front_test, brkpd_rear_test, brkdrum_test],
        (err, results) => {
            if (err)
                return reject(err);

            resolve(results);
        });
    })
    .then(() => response.status(200).send(`Szczegóły wyniku kontroli o ID nr ${id} zostały zaktualizowane.`))
    .catch((err) => response.status(500).send(`Błąd serwera SQL - ${err.message} (kod ${err.code}).`));
}

// Funkcja HTTP DELETE dla tabeli vc_results,
// z ID okreslonym w parametrach zadania HTTP.
var deleteResult = function (request, response) {
    let id = parseInt(request.params.id);
    pool.query('SELECT * FROM vc_results WHERE id = $1', [id])
    .then((results) => {
        if (results.rows.length > 0) {
            pool.query('DELETE FROM vc_results WHERE id = $1', [id], (err, _results) => {
                if (err)
                    response.status(500).send(`Błąd serwera SQL - ${err.message} (kod ${err.code}).`);
                else
                    response.status(200).send(`Wynik kontroli o ID nr ${id} został usunięty.`);
            });
        } else {
            response.status(404).send("Nie znaleziono");
            return;
        }
    })
    .catch((err) => {
        response.status(500).send(`Błąd serwera SQL - ${err.message} (kod ${err.code}).`);
        return;
    });
}

// Eksport funkcji do uzytku na zewnatrz
exports.getResultsList = getResultsList;
exports.getResultById = getResultById;
exports.postResult = postResult;
exports.updateResult = updateResult;
exports.deleteResult = deleteResult;
