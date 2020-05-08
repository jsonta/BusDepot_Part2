require('dotenv').config();
const pg = require('pg');

let config = {
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    port: process.env.PGPORT
};
let pool = new pg.Pool(config);

module.exports = pool;