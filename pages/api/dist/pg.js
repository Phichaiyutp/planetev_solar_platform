"use strict";
exports.__esModule = true;
var pg_1 = require("pg");
var pool = new pg_1.Pool({
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: Number(process.env.DB_PORT)
});
exports["default"] = pool;
