const pool = require('./pool.js');
const moment = require('moment');

// Funkcja HTTP GET dla tabeli vc_persons.
var getPersonsList = function(_request, response) {
    pool.query('SELECT * FROM vc_persons', (err, results) => {
        if (err)
            response.status(500).send(`Error: ${err.message} (${err.code})`);
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
            response.status(500).send(`Error: ${err.message} (${err.code})`);
        else {
            if (results.rows.length == 0)
                response.status(404).send("Nie znaleziono");
            else
                response.status(200).json(results.rows[0]);
        }
    });
}

// Funkcja HTTP POST dla tabeli vc_persons.
var postPerson = function(request, response) {
    let {
        fname, lname, idcard, phone, email, bday_date, addr_strtname, addr_bldgname, addr_apmtname, city, zip
    } = request.body;
    bday_date = moment(bday_date, "YYYY-MM-DD");

    pool.query('INSERT INTO vc_persons VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
    [fname, lname, idcard, phone, email, bday_date, addr_strtname, addr_bldgname, addr_apmtname, city, zip],
    (err, results) => {
        if (err)
            response.status(500).send(`Error: ${err.message} (${err.code})`);
        else
            response.status(201).send(`Dodano nową osobę o ID nr ${results.rows[0].id}.`);
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
    let responseMsg = `Dane osoby o ID nr ${id} zostały zaktualizowane`;

    // Odczyt wpisu o podanym ID z bazy danych celem uzupelnienia
    // brakujacych danych wymaganych dla kwerendy UPDATE.
    let lastOpFailed = false;

    await new Promise((resolve, reject) => {
        pool.query('SELECT * FROM vc_persons WHERE id = $1', [id], (err, results) => {
            if (err)
                return reject(err);

            resolve(results.rows);
        });
    })
    .then((person) => {
        if (person.length != 0) {
            if (fname == undefined)
                fname = person[0].fname;

            if (lname == undefined)
                lname = person[0].lname;

            if (idcard == undefined)
                idcard = person[0].idcard;

            if (phone == undefined)
                phone = person[0].phone;

            if (email == undefined)
                email = person[0].email;

            if (bday_date == undefined)
                bday_date = person[0].bday_date;
        
            if (addr_strtname == undefined)
                addr_strtname = person[0].addr_strtname;

            if (addr_bldgname == undefined)
                addr_bldgname = person[0].addr_bldgname;

            if (addr_apmtname == undefined)
                addr_apmtname = person[0].addr_apmtname;

            if (city == undefined)
                city = person[0].city;
        
            if (zip == undefined)
                zip = person[0].zip;
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
            pool.query('UPDATE vc_persons SET fname = $2, lname = $3, idcard = $4, phone = $5, email = $6, bday_date = $7, addr_strtname = $8, addr_bldgname = $9, addr_apmtname = $10, city = $11, zip = $12 WHERE id = $1',
            [id, fname, lname, idcard, phone, email, bday_date, addr_strtname, addr_bldgname, addr_apmtname, city, zip],
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

// Funkcja HTTP DELETE dla tabeli vc_persons,
// z ID okreslonym w parametrach zadania HTTP.
var deletePerson = function (request, response) {
    let id = parseInt(request.params.id);

    pool.query('DELETE FROM vc_persons WHERE id = $1', [id], (err, _results) => {
        if (err)
            response.status(500).send(`Error: ${err.message} (${err.code})`);
        else
            response.status(200).send(`Osoba o ID nr ${id} została usunięta.`);
    });
}

// Eksport funkcji do uzytku na zewnatrz
exports.getPersonsList = getPersonsList;
exports.getPersonById = getPersonById;
exports.postPerson = postPerson;
exports.updatePerson = updatePerson;
exports.deletePerson = deletePerson;