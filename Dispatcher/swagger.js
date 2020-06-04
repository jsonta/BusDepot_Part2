const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'BusDepot (Dispatcher)',
            description: 'Mikroserwis zarządzający ewidencją wyjazdów i zjazdów do zajezdni.',
            version: '20200603',
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
                            description: "Identyfikator wyjazdu/zjazdu z/do zajezdni (generowany automatycznie).",
                            example: 1
                        },
                        date: {
                            type: "string",
                            description: "Data wyjazdu/zjazdu z/do zajezdni. Baza danych przechowuje w tej kolumnie TYLKO datę.",
                            pattern: "\\d{4}-\\d{2}-\\d{2}",
                            example: "2020-06-01"
                        },
                        time: {
                            type: "string",
                            description: "Godzina wyjazdu/zjazdu z/do zajezdni.",
                            pattern: "\\d{2}:\\d{2}:\\d{2}",
                            example: "06:00:00"
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
                            description: "Identyfikator kierowcy wyjeżdżającego/zjeżdżającego.",
                            example: 1
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
                            description: "Identyfikator kierowcy wyjeżdżającego/zjeżdżającego.",
                            example: 1
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