const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'BusDepot (VehicleControl)',
            description: 'Mikroserwis zarządzający ewidencją wewnętrznej stacji kontroli pojazdów.',
            version: '20200523',
            contact: {
                "name": "Jakub Sońta",
                "url": "https://github.com/jsonta",
            },
            license: {
                name: "MIT License",
                url: "https://github.com/jsonta/BusDepot_Part2/blob/master/LICENSE"
            }
        },
        tags: [
            {name: "Persons"},
            {name: "Results"},
            {name: "Vehicles"}
        ],
        components: {
            schemas: {
                Person: {
                    type: "object",
                    properties: {
                        id: {
                            type: "integer",
                            description: "Identyfikator (nr PESEL) osoby zlecającej kontrolę pojazdu.",
                            example: 99123100000
                        },
                        fname: {
                            type: "string",
                            description: "Imię osoby zlecającej kontrolę pojazdu.",
                            example: "Jan"
                        },
                        lname: {
                            type: "string",
                            description: "Nazwisko osoby zlecającej kontrolę pojazdu.",
                            example: "Kowalski"
                        },
                        idcard: {
                            type: "string",
                            description: "Seria i numer dowodu osobistego osoby zlecającej kontrolę pojazdu.",
                            pattern: "([A-Z]){3}\\d{6}",
                            example: "XYZ123456"
                        },
                        phone: {
                            type: "integer",
                            description: "Numer telefonu osoby zlecającej kontrolę pojazdu.",
                            example: 123456789
                        },
                        email: {
                            type: "string",
                            description: "Adres e-mail osoby zlecającej kontrolę pojazdu (opcjonalny).",
                            pattern: "^(([^<>()\\[\\]\\\\.,;:\\s@\"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@\"]+)*)|(\".+\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$",
                            example: "nazwa@domena.pl"
                        },
                        bday_date: {
                            type: "string",
                            description: "Data urodzenia osoby zlecającej kontrolę pojazdu (YYYY-MM-DD).",
                            pattern: "\\d{4}-\\d{2}-\\d{2}",
                            example: "2020-05-08"
                        },
                        addr_strtname: {
                            type: "string",
                            description: "Adres zamieszkania osoby zlecającej kontrolę pojazdu - nazwa ulicy.",
                            example: "Stacyjna"
                        },
                        addr_bldgnmbr: {
                            type: "integer",
                            description: "Adres zamieszkania osoby zlecającej kontrolę pojazdu - numer budynku.",
                            example: 1
                        },
                        addr_apmtname: {
                            type: "integer",
                            description: "Adres zamieszkania osoby zlecającej kontrolę pojazdu - numer lokalu/mieszkania (opcjonalny).",
                            example: 2
                        },
                        city: {
                            type: "string",
                            description: "Adres zamieszkania osoby zlecającej kontrolę pojazdu - miasto.",
                            example: "Warszawa"
                        },
                        zip: {
                            type: "string",
                            description: "Adres zamieszkania osoby zlecającej kontrolę pojazdu - kod pocztowy.",
                            pattern: "\\d{2}-\\d{3}",
                            example: "01-234"
                        }
                    },
                    required: [
                        "id",
                        "fname",
                        "lname",
                        "idcard",
                        "phone",
                        "bday_date",
                        "addr_strtname",
                        "addr_bldgnmbr",
                        "city",
                        "zip"
                    ]
                },
                Result: {
                    type: "object",
                    properties: {
                        id: {
                            type: "integer",
                            description: "Identyfikator wyników kontroli.",
                            example: 1
                        },
                        car_id: {
                            type: "integer",
                            description: "Identyfikator pojazdu poddanego kontroli.",
                            example: 1
                        },
                        cntl_date: {
                            type: "string",
                            description: "Data przeprowadzenia kontroli. Baza danych przechowuje w tej kolumnie TYLKO datę.",
                            pattern: "\\d{4}-\\d{2}-\\d{2}",
                            example: "2020-05-08"
                        },
                        cntl_time: {
                            type: "string",
                            description: "Godzina przeprowadzenia kontroli.",
                            pattern: "\\\\d{2}:\\\\d{2}:\\\\d{2}",
                            example: "22:00:00"
                        },
                        brkds_front_test: {
                            type: "boolean",
                            description: "Wynik testu tarczy hamulcowej lewej.",
                            example: true
                        },
                        brkpd_front_test: {
                            type: "boolean",
                            description: "Wynik testu klocka hamulcowego lewego.",
                            example: true
                        },
                        brkds_rear_test: {
                            type: "boolean",
                            description: "Wynik testu tarczy hamulcowej prawej.",
                            example: true
                        },
                        brkpd_rear_test: {
                            type: "boolean",
                            description: "Wynik testu klocka hamulcowego prawego.",
                            example: true
                        },
                        brkdrum_test: {
                            type: "boolean",
                            description: "Wynik testu bębna hamulcowego.",
                            example: true
                        }
                    },
                    required: [
                        "id",
                        "car_id",
                        "cntl_date",
                        "cntl_time",
                        "brkds_front_test",
                        "brkpd_front_test",
                        "brkds_rear_test",
                        "brkpd_rear_test",
                        "brkdrum_test"
                    ]
                },
                Vehicle: {
                    type: "object",
                    properties: {
                        id: {
                            type: "integer",
                            description: "Identyfikator pojazdu poddanego kontroli.",
                            example: 1
                        },
                        brand: {
                            type: "string",
                            description: "Marka/producent pojazdu poddanego kontroli.",
                            example: "Solaris"
                        },
                        model: {
                            type: "string",
                            description: "Model pojazdu poddanego kontroli.",
                            example: "Urbino 12"
                        },
                        vrn: {
                            type: "string",
                            description: "Numer rejestracyjny pojazdu poddanego kontroli.",
                            example: "AB 12345"
                        },
                        person: {
                            type: "integer",
                            description: "Identyfikator (numer ID) pojazdu osoby zlecającej kontrolę pojazdu.",
                            example: 99123100000
                        },
                        vin: {
                            type: "string",
                            description: "Numer VIN pojazdu poddanego kontroli."
                        },
                        yr_prod: {
                            type: "integer",
                            description: "Rok produkcji pojazdu poddanego kontroli.",
                            example: 1999
                        },
                        mileage: {
                            type: "integer",
                            description: "Przebieg (km) pojazdu poddanego kontroli.",
                            example: 1000000
                        },
                        eng_cpct: {
                            type: "integer",
                            description: "Pojemność silnika (cm^3) pojazdu poddanego kontroli.",
                            example: 2800
                        },
                        eng_type: {
                            type: "string",
                            description: "Rodzaj silnika pojazdu poddanego kontroli.",
                            example: "diesel"
                        }
                    },
                    required: [
                        "id",
                        "brand",
                        "model",
                        "vrn",
                        "person",
                        "vin",
                        "yr_prod",
                        "mileage",
                        "eng_cpct",
                        "eng_type"
                    ]
                }
            }
          }
    },

    apis: ['./routes.js']
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;