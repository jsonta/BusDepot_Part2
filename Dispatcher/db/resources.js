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
                reject({
                    errno: 404,
                    code: "Not Found"
                });
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
                reject({
                    errno: 404,
                    code: "Not Found"
                });
            }
        });
    });
}
function getDriverInSrvStatus(id) {
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
function updBrigadeInSrvStatus(id, status) {
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
function updBusInSrvStatus(id, status) {
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
function updDriverInSrvStatus(id, status) {
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

// Odczyt informacji z bazy danych - funkcje asynchroniczne
var readBrigadeInSrvStatus = async function(request, response) {
    let id = request.params.id;

    await getBrigadeInSrvStatus(id)
    .then((in_service) => {
        response.status(200).send(in_service);
    })
    .catch((err) => {
        let errNo = parseInt(err.errno);

        if (errNo >= 400) {
            response.status(errNo)
                    .send("Error: "+err.code+" ("+errNo+")");
        } else {
            response.status(400)
                    .send("Error: "+err.code+" ("+errNo+")");
        }
    });
}
var readBusInSrvStatus = async function(request, response) {
    let id = request.params.id;

    await getBusInSrvStatus(id)
    .then((in_service) => {
        response.status(200).send(in_service);
    })
    .catch((err) => {
        let errNo = parseInt(err.errno);

        if (errNo >= 400) {
            response.status(errNo)
                    .send("Error: "+err.code+" ("+errNo+")");
        } else {
            response.status(400)
                    .send("Error: "+err.code+" ("+errNo+")");
        }
    });
}
var readDriverInSrvStatus = async function(request, response) {
    let id = request.params.id;

    await getDriverInSrvStatus(id)
    .then((in_service) => {
        response.status(200).send(in_service);
    })
    .catch((err) => {
        let errNo = parseInt(err.errno);

        if (errNo >= 400) {
            response.status(errNo)
                    .send("Error: "+err.code+" ("+errNo+")");
        } else {
            response.status(400)
                    .send("Error: "+err.code+" ("+errNo+")");
        }
    });
}

// Zmiana wartosci 'in_service' - funkcje asynchroniczne
var flipBrigadeInSrvStatus = async function(request, response) {
    let id = request.params.id;
    let errReturned = false;
    let status;

    await getBrigadeInSrvStatus(id)
    .then((in_service) => {
        status = !!in_service;
    })
    .catch((err) => {
        errReturned = !errReturned;
        let errNo = parseInt(err.errno);

        if (errNo >= 400) {
            response.status(errNo)
                    .send("Error: "+err.code+" ("+errNo+")");
        } else {
            response.status(400)
                    .send("Error: "+err.code+" ("+errNo+")");
        }
    });

    if (!errReturned) {
        status = !status;
        
        await updBrigadeInSrvStatus(id, status)
        .then(() => {
            response.sendStatus(200);
        })
        .catch((err) => {
            let errNo = parseInt(err.errno);

            if (errNo >= 400) {
                response.status(errNo)
                        .send("Error: "+err.code+" ("+errNo+")");
            } else {
                response.status(400)
                        .send("Error: "+err.code+" ("+errNo+")");
            }
        });
    }
}
var flipBusInSrvStatus = async function(request, response) {
    let id = parseInt(request.params.id);
    let errReturned = false;
    let status;

    await getBusInSrvStatus(id)
    .then((in_service) => {
        status = !!in_service;
    })
    .catch((err) => {
        errReturned = !errReturned;
        let errNo = parseInt(err.errno);

        if (errNo >= 400) {
            response.status(errNo)
                    .send("Error: "+err.code+" ("+errNo+")");
        } else {
            response.status(400)
                    .send("Error: "+err.code+" ("+errNo+")");
        }
    });

    if (!errReturned) {
        status = !status;

        await updBusInSrvStatus(id, status)
        .then(() => {
            response.sendStatus(200);
        })
        .catch((err) => {
            let errNo = parseInt(err.errno);

            if (errNo >= 400) {
                response.status(errNo)
                        .send("Error: "+err.code+" ("+errNo+")");
            } else {
                response.status(400)
                        .send("Error: "+err.code+" ("+errNo+")");
            }
        });
    }
}
var flipDriverInSrvStatus = async function(request, response) {
    let id = parseInt(request.params.id);
    let errReturned = false;
    let status;

    await getDriverInSrvStatus(id)
    .then((in_service) => {
        status = !!in_service;
    })
    .catch((err) => {
        errReturned = !errReturned;
        let errNo = parseInt(err.errno);

        if (errNo >= 400) {
            response.status(errNo)
                    .send("Error: "+err.code+" ("+errNo+")");
        } else {
            response.status(400)
                    .send("Error: "+err.code+" ("+errNo+")");
        }
    });

    if (!errReturned) {
        status = !status;

        await updDriverInSrvStatus(id, status)
        .then(() => {
            response.sendStatus(200);
        })
        .catch((err) => {
            let errNo = parseInt(err.errno);

            if (errNo >= 400) {
                response.status(errNo)
                        .send("Error: "+err.code+" ("+errNo+")");
            } else {
                response.status(400)
                        .send("Error: "+err.code+" ("+errNo+")");
            }
        });
    }
}

// Eksport funkcji asynchronicznych do uzytku na zewnatrz
exports.readBrigadeInSrvStatus = readBrigadeInSrvStatus;
exports.readBusInSrvStatus = readBusInSrvStatus;
exports.readDriverInSrvStatus = readDriverInSrvStatus;
exports.flipBrigadeInSrvStatus = flipBrigadeInSrvStatus;
exports.flipBusInSrvStatus = flipBusInSrvStatus;
exports.flipDriverInSrvStatus = flipDriverInSrvStatus;
