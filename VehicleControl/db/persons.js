const pool = require('./pool.js');
const moment = require('moment');

// Funkcja HTTP GET dla tabeli vc_persons.
var getPersonsList = function(_request, response) {
    pool.query('SELECT * FROM vc_persons', (err, results) => {
        if (err)
            response.status(500).send(`Błąd serwera SQL - ${err.message} (kod ${err.code}).`);
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
            response.status(500).send(`Błąd serwera SQL - ${err.message} (kod ${err.code}).`);
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
        fname, lname, pesel, idcard, phone, email, bday_date, street, building, apartment, city, zip
    } = request.body;
    bday_date = moment(bday_date, "YYYY-MM-DD");

    pool.query('INSERT INTO vc_persons (fname, lname, pesel, idcard, bday_date, phone, email, street, building, apartment, city, zip) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *',
    [fname, lname, pesel, idcard, bday_date, phone, email, street, building, apartment, city, zip],
    (err, results) => {
        if (err)
            response.status(500).send(`Błąd serwera SQL - ${err.message} (kod ${err.code}).`);
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
        fname, lname, pesel, idcard, phone, email, bday_date, street, building, apartment, city, zip
    } = request.body;
    if (bday_date != undefined)
        bday_date = moment(bday_date, "YYYY-MM-DD");

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

            if (pesel == undefined)
                pesel = person[0].pesel;

            if (idcard == undefined)
                idcard = person[0].idcard;

            if (bday_date == undefined)
                bday_date = person[0].bday_date;

            if (phone == undefined)
                phone = person[0].phone;

            if (email == undefined)
                email = person[0].email;
        
            if (street == undefined)
                street = person[0].street;

            if (building == undefined)
                building = person[0].building;

            if (apartment == undefined)
                apartment = person[0].apartment;

            if (city == undefined)
                city = person[0].city;
        
            if (zip == undefined)
                zip = person[0].zip;
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
        pool.query('UPDATE vc_persons SET fname = $2, lname = $3, pesel = $4, idcard = $5, bday_date = $6, phone = $7, email = $8, street = $9, building = $10, apartment = $11, city = $12, zip = $13 WHERE id = $1',
        [id, fname, lname, pesel, idcard, bday_date, phone, email, street, building, apartment, city, zip],
        (err, results) => {
            if (err)
                return reject(err);

            resolve(results);
        });
    })
    .then(() => response.status(200).send(`Szczegóły osoby o ID nr ${id} zostały zaktualizowane.`))
    .catch((err) => response.status(500).send(`Błąd serwera SQL - ${err.message} (kod ${err.code}).`));
}

// Funkcja HTTP DELETE dla tabeli vc_persons,
// z ID okreslonym w parametrach zadania HTTP.
var deletePerson = function (request, response) {
    let id = parseInt(request.params.id);
    pool.query('SELECT * FROM vc_persons WHERE id = $1', [id])
    .then((results) => {
        if (results.rows.length > 0) {
            pool.query('DELETE FROM vc_persons WHERE id = $1', [id], (err, _results) => {
                if (err)
                    response.status(500).send(`Błąd serwera SQL - ${err.message} (kod ${err.code}).`);
                else
                    response.status(200).send(`Osoba o ID nr ${id} została usunięta.`);
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
exports.getPersonsList = getPersonsList;
exports.getPersonById = getPersonById;
exports.postPerson = postPerson;
exports.updatePerson = updatePerson;
exports.deletePerson = deletePerson;