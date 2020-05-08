const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const routes = require('./routes.js');
app.use('/api', routes);
app.get('/', (req, res) => {
    res.send('Hello world');
});

app.listen(5002);