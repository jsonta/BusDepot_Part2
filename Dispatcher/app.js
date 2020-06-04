const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const routes = require('./routes.js');
app.use('/dispatcher', routes);

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger.js');
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(5003);
