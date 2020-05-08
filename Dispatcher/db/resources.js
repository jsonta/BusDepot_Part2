const pool = require('./pool.js');

// Odczyt informacji z bazy danych
function getBrigadeInSrvStatus(id) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT in_service FROM brigades WHERE id = $1', [id],
        (err, results) => {
            if (err) {
                return reject(err);
            }

            if (results.rowCount > 0) {
                resolve(results.rows[0].in_service);
            } else {
                reject(404);
            }
        });
    });
}
function getBusInSrvStatus(id) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT in_service FROM buses WHERE id = $1', [id],
        (err, results) => {
            if (err) {
                return reject(err);
            }

            if (results.rowCount > 0) {
                resolve(results.rows[0].in_service);
            } else {
                reject(404);
            }
        });
    });
}

// Aktualizacja informacji w bazie danych
function updBusInSrvStatus(id, status) {
    return new Promise((resolve, reject) => {
        pool.query('UPDATE buses SET in_service = $2 WHERE id = $1',
        [id, status], (err, results) => {
            if (err) {
                return reject(err);
            }

            resolve(200);
        });
    });
}
function updBrigadeInSrvStatus(id, status) {
    return new Promise((resolve, reject) => {
        pool.query('UPDATE brigades SET in_service = $2 WHERE id = $1',
        [id, status], (err, results) => {
            if (err) {
                return reject(err);
            }

            resolve(200);
        });
    });
}

// Zmiana wartosci 'in_service' - funkcje asynchroniczne
var flipBusInSrvStatus = async function(request, response) {
    const id = parseInt(request.params.id);
    var status;

    await getBusInSrvStatus(id)
            .then((in_service) => {
                status = !!in_service;
            })
            .catch(err => response.sendStatus(parseInt(err)));

    status = !status;
    await updBusInSrvStatus(id, status).then((statusCode) => {
        response.sendStatus(parseInt(statusCode));
    });
}
var flipBrigadeInSrvStatus = async function(request, response) {
    const id = request.params.id;
    var status;

    await getBrigadeInSrvStatus(id)
            .then((in_service) => {
                status = !!in_service;
            })
            .catch(err => response.sendStatus(parseInt(err)));

    status = !status;
    await updBrigadeInSrvStatus(id, status).then((statusCode) => {
        response.sendStatus(parseInt(statusCode));
    });
}

// Eksport funkcji asynchronicznych do uzytku na zewnatrz
exports.flipBrigadeInSrvStatus = flipBrigadeInSrvStatus;
exports.flipBusInSrvStatus = flipBusInSrvStatus;
