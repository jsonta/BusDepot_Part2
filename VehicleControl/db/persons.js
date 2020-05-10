const pool = require('./pool.js');
const moment = require('moment');

// Funkcja HTTP GET dla tabeli vc_persons.
var getPersonsList = function(_request, response) {
    pool.query('SELECT * FROM vc_persons', (err, results) => {
        if (err)
            response.status(400).send(`Error: ${err.message} (${err.code})`);
        else
            response.status(200).json(results.rows);
    });
}

// Funkcja HTTP GET dla tabeli vc_persons,
// z ID okreslonym w parametrach zadania HTTP.
var getPersonById = function(request, response) {
    let id = parseInt(request.params.id);
    pool.query('SELECT * FROM vc_persons WHERE id = $1', [id], (err, results) => {
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

// Funkcja HTTP POST dla tabeli vc_persons.
var postPerson = function(request, response) {
    let {
        id, fname, lname, idcard, phone, email, bday_date, addr_strtname, addr_bldgname, addr_apmtname, city, zip
    } = request.body;
    bday_date = moment(bday_date, "YYYY-MM-DD");

    pool.query('INSERT INTO vc_persons VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)',
    [id, fname, lname, idcard, phone, email, bday_date, addr_strtname, addr_bldgname, addr_apmtname, city, zip],
    (err, results) => {
        if (err)
            response.status(400).send(`Error: ${err.message} (${err.code})`);
        else
            response.status(201).send(`Person added with ID: ${id}`);
    });
}

// Funkcja HTTP PUT dla tabeli vc_persons,
// z ID okreslonym w parametrach zadania HTTP.
var updatePerson = async function(request, response) {
    // Odczyt danych z przeslanego zadania HTTP.
    let id = parseInt(request.params.id);
    let {
        fname, lname, idcard, phone, email, bday_date, addr_strtname, addr_bldgname, addr_apmtname, city, zip
    } = request.body;
    if (bday_date != undefined)
        bday_date = moment(bday_date, "YYYY-MM-DD");

    // Wstepne wartosci kodu i tresci odpowiedzi HTTP.
    let responseCode = 200;
    let responseMsg = `Person with ID ${id} updated`;

    // Odczyt wpisu o podanym ID z bazy danych celem uzupelnienia
    // brakujacych danych wymaganych dla kwerendy UPDATE.
    let lastOpFailed = false;

    await new Promise((resolve, reject) => {
        pool.query('SELECT * FROM vc_persons WHERE id = $1', [id], (err, results) => {
            if (err)
                return reject(err);

            resolve(results.rows[0]);
        });
    })
    .then((person) => {
        if (fname == undefined)
            fname = person.fname;

        if (lname == undefined)
            lname = person.lname;

        if (idcard == undefined)
            idcard = person.idcard;

        if (phone == undefined)
            phone = person.phone;

        if (email == undefined)
            email = person.email;

        if (bday_date == undefined)
            bday_date = person.bday_date;
        
        if (addr_strtname == undefined)
            addr_strtname = person.addr_strtname;

        if (addr_bldgname == undefined)
            addr_bldgname = person.addr_bldgname;

        if (addr_apmtname == undefined)
            addr_apmtname = person.addr_apmtname;

        if (city == undefined)
            city = person.city;
        
        if (zip == undefined)
            zip = person.zip;
    })
    .catch((err) => {
        responseCode = 400;
        responseMsg = `Error: ${err.message} (${err.code})`;
        lastOpFailed = !lastOpFailed;
    });

    // Aktualizacja wpisu w bazie danych.
    // Wykona się tylko wtedy, jesli po drodze nie wystapil
    // zaden blad podczas odczytu z bazy danych.
    if (!lastOpFailed) {
        await new Promise((resolve, reject) => {
            pool.query('UPDATE vc_persons SET fname = $2, lname = $3, idcard = $4, phone = $5, email = $6, bday_date = $7, addr_strtname = $8, addr_bldgname = $9, addr_apmtname = $10, city = $11, zip = $12 WHERE id = $1',
            [id, fname, lname, idcard, phone, email, bday_date, addr_strtname, addr_bldgname, addr_apmtname, city, zip],
            (err, results) => {
                if (err)
                    return reject(err);

                resolve(results);
            });
        })
        .catch((err) => {
            responseCode = 400;
            responseMsg = `Error: ${err.message} (${err.code})`;
        });
    }

    // Wyslanie odpowiedzi HTTP
    response.status(responseCode).send(responseMsg);
}

// Funkcja HTTP DELETE dla tabeli vc_persons,
// z ID okreslonym w parametrach zadania HTTP.
var deletePerson = function (request, response) {
    let id = parseInt(request.params.id);

    pool.query('DELETE FROM vc_persons WHERE id = $1', [id], (err, _results) => {
        if (err)
            response.status(400).send(`Error: ${err.message} (${err.code})`);
        else
            response.status(200).send(`Person with ID ${id} deleted`);
    });
}

// Eksport funkcji do uzytku na zewnatrz
exports.getPersonsList = getPersonsList;
exports.getPersonById = getPersonById;
exports.postPerson = postPerson;
exports.updatePerson = updatePerson;
exports.deletePerson = deletePerson;