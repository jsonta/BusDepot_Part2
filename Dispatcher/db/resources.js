const pool = require('./pool.js');

// Odczyt informacji z bazy danych
var getBrigadeInSrvStatus = function(id) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT in_service FROM brigades WHERE id = $1', [id],
        (err, results) => {
            if (err) {
                return reject(err);
            }

            if (results.rowCount > 0) {
                resolve(results.rows[0].in_service);
            } else {
                reject({
                    errno: 404,
                    code: "Not Found"
                });
            }
        });
    });
}
var getBusInSrvStatus = function(id) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT in_service FROM buses WHERE id = $1', [id],
        (err, results) => {
            if (err) {
                return reject(err);
            }

            if (results.rowCount > 0) {
                resolve(results.rows[0].in_service);
            } else {
                reject({
                    errno: 404,
                    code: "Not Found"
                });
            }
        });
    });
}
var getDriverInSrvStatus = function(id) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT in_service FROM drivers WHERE id = $1', [id],
        (err, results) => {
            if (err) {
                return reject(err);
            }

            if (results.rowCount > 0) {
                resolve(results.rows[0].in_service);
            } else {
                reject({
                    errno: 404,
                    code: "Not Found"
                });
            }
        });
    });
}

// Aktualizacja informacji w bazie danych
var updBrigadeInSrvStatus = function(id, status) {
    return new Promise((resolve, reject) => {
        pool.query('UPDATE brigades SET in_service = $2 WHERE id = $1',
        [id, status], (err, results) => {
            if (err) {
                return reject(err);
            }

            resolve(results);
        });
    });
}
var updBusInSrvStatus = function(id, status) {
    return new Promise((resolve, reject) => {
        pool.query('UPDATE buses SET in_service = $2 WHERE id = $1',
        [id, status], (err, results) => {
            if (err) {
                return reject(err);
            }

            resolve(results);
        });
    });
}
var updDriverInSrvStatus = function(id, status) {
    return new Promise((resolve, reject) => {
        pool.query('UPDATE drivers SET in_service = $2 WHERE id = $1',
        [id, status], (err, results) => {
            if (err) {
                return reject(err);
            }

            resolve(results);
        });
    });
}

// Eksport funkcji do uzytku na zewnatrz
exports.getBrigadeInSrvStatus = getBrigadeInSrvStatus;
exports.getBusInSrvStatus = getBusInSrvStatus;
exports.getDriverInSrvStatus = getDriverInSrvStatus;
exports.updBrigadeInSrvStatus = updBrigadeInSrvStatus;
exports.updBusInSrvStatus = updBusInSrvStatus;
exports.updDriverInSrvStatus = updDriverInSrvStatus;
