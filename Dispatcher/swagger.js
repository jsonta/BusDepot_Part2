const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'BusDepot (Dispatcher)',
            description: 'Mikroserwis zarządzający ewidencją wyjazdów i zjazdów do zajezdni.',
            version: '20200522',
            contact: {
                "name": "Jakub Sońta",
                "url": "https://github.com/jsonta",
            },
            license: {
                name: "MIT License",
                url: "https://github.com/jsonta/BusDepot_Part1/blob/master/LICENSE"
            }
        },
        tags: [
            {name: "Departures"},
            {name: "Exits"},
        ],
        components: {
            schemas: {
                DepExitDetails: {
                    type: "object",
                    properties: {
                        id: {
                            type: "integer",
                            description: "Identyfikator wyjazdu/zjazdu z/do zajezdni.",
                            example: 1
                        },
                        date: {
                            type: "string",
                            description: "Data wyjazdu/zjazdu z/do zajezdni. Baza danych przechowuje w tej kolumnie TYLKO datę.",
                            pattern: "\\d{4}-\\d{2}-\\d{2}T{1}\\d{2}:{1}\\d{2}:{1}\\d{2}.{1}\\d{3}Z{1}",
                            example: "2020-05-08T22:00:00.000Z"
                        },
                        time: {
                            type: "string",
                            description: "Godzina wyjazdu/zjazdu z/do zajezdni.",
                            pattern: "\\d{2}:\\d{2}:\\d{2}",
                            example: "22:00:00"
                        },
                        brigade: {
                            type: "string",
                            description: "Identyfikator brygady wyjeżdżającej/zjeżdżającej z/do zajezdni (linia-brygada).",
                            pattern: "\\d{3}-\\d{2}",
                            example: "901-01"
                        },
                        bus_id: {
                            type: "integer",
                            description: "Identyfikator (nr boczny) autobusu wyjeżdżającego/zjeżdżającego z/do zajezdni.",
                            example: 1000
                        },
                        driver: {
                            type: "integer",
                            description: "Identyfikator (nr PESEL) kierowcy wyjeżdżającego/zjeżdżającego.",
                            example: 99123100000
                        }
                    }
                },
                LogDetails: {
                    type: "object",
                    properties: {
                        brigade: {
                            type: "string",
                            description: "Identyfikator brygady wyjeżdżającej/zjeżdżającej z/do zajezdni (linia-brygada).",
                            pattern: "\\d{3}-\\d{2}",
                            example: "901-01",
                        },
                        bus_id: {
                            type: "integer",
                            description: "Identyfikator (nr boczny) autobusu wyjeżdżającego/zjeżdżającego z/do zajezdni.",
                            example: 1000
                        },
                        driver: {
                            type: "integer",
                            description: "Identyfikator (nr PESEL) kierowcy wyjeżdżającego/zjeżdżającego.",
                            example: 99123100000
                        }
                    },
                    required: [
                        "brigade",
                        "bus_id",
                        "driver"
                    ]
                }
            }
        }
    },

    apis: ['./routes.js']
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;