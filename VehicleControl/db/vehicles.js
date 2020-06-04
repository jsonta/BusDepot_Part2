const pool = require('./pool.js');

// Funkcja HTTP GET dla tabeli vc_vehicles.
var getVehiclesList = function(_request, response) {
    pool.query('SELECT * FROM vc_vehicles', (err, results) => {
        if (err)
            response.status(500).send(`Error: ${err.message} (${err.code})`);
        else
            response.status(200).json(results.rows);
    });
}

// Funkcja HTTP GET dla tabeli vc_vehicles,
// z ID okreslonym w parametrach zadania HTTP.
var getVehicleById = function(request, response) {
    let id = parseInt(request.params.id);
    pool.query('SELECT * FROM vc_vehicles WHERE id = $1', [id], (err, results) => {
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

// Funkcja HTTP POST dla tabeli vc_vehicles.
var postVehicle = function(request, response) {
    let {
        brand, model, vrn, person, vin, yr_prod, mileage, eng_cpct, eng_type
    } = request.body;

    pool.query('INSERT INTO vc_vehicles (brand, model, vrn, person, vin, yr_prod, mileage, eng_cpct, eng_type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
    [brand, model, vrn, person, vin, yr_prod, mileage, eng_cpct, eng_type],
    (err, results) => {
        if (err)
            response.status(500).send(`Error: ${err.message} (${err.code})`);
        else
            response.status(201).send(`Dodano nowy pojazd o ID nr ${results.rows[0].id}.`);
    });
}

// Funkcja HTTP PUT dla tabeli vc_vehicles,
// z ID okreslonym w parametrach zadania HTTP.
var updateVehicle = async function(request, response) {
    // Odczyt danych z przeslanego zadania HTTP.
    let id = parseInt(request.params.id);
    let {
        brand, model, vrn, person, vin, yr_prod, mileage, eng_cpct, eng_type
    } = request.body;

    // Wstepne wartosci kodu i tresci odpowiedzi HTTP.
    let responseCode = 200;
    let responseMsg = `Dane pojazdu o ID nr ${id} zostały zaktualizowane.`;

    // Odczyt wpisu o podanym ID z bazy danych celem uzupelnienia
    // brakujacych danych wymaganych dla kwerendy UPDATE.
    let lastOpFailed = false;

    await new Promise((resolve, reject) => {
        pool.query('SELECT * FROM vc_vehicles WHERE id = $1', [id], (err, results) => {
            if (err)
                return reject(err);

            resolve(results.rows);
        });
    })
    .then((vehicle) => {
        if (vehicle.length != 0) {
            if (brand == undefined)
                brand = vehicle[0].brand;

            if (model == undefined)
                model = vehicle[0].model;

            if (vrn == undefined)
                vrn = vehicle[0].vrn;

            if (person == undefined)
                person = vehicle[0].person;

            if (vin == undefined)
                vin = vehicle[0].vin;

            if (yr_prod == undefined)
                yr_prod = vehicle[0].yr_prod;
        
            if (mileage == undefined)
                mileage = vehicle[0].mileage;

            if (eng_cpct == undefined)
                eng_cpct = vehicle[0].eng_cpct;

            if (eng_type == undefined)
                eng_type = vehicle[0].eng_type;
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
            pool.query('UPDATE vc_vehicles SET brand = $2, model = $3, vrn = $4, person = $5, vin = $6, yr_prod = $7, mileage = $8, eng_cpct = $9, eng_type = $10 WHERE id = $1',
            [id, brand, model, vrn, person, vin, yr_prod, mileage, eng_cpct, eng_type],
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

// Funkcja HTTP DELETE dla tabeli vc_vehicles,
// z ID okreslonym w parametrach zadania HTTP.
var deleteVehicle = function (request, response) {
    let id = parseInt(request.params.id);

    pool.query('DELETE FROM vc_vehicles WHERE id = $1', [id], (err, _results) => {
        if (err)
            response.status(500).send(`Error: ${err.message} (${err.code})`);
        else
            response.status(200).send(`Pojazd o ID nr ${id} został usunięty.`);
    });
}

// Eksport funkcji do uzytku na zewnatrz
exports.getVehiclesList = getVehiclesList;
exports.getVehicleById = getVehicleById;
exports.postVehicle = postVehicle;
exports.updateVehicle = updateVehicle;
exports.deleteVehicle = deleteVehicle;
