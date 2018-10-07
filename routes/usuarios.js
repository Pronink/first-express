const express = require('express');
const router = express.Router();
const sql = require('mssql');
const singleton = require('../conexionSingleton');

/* GET users listing. */
router.get('/', function (req, res, next) {
    const request = new sql.Request(singleton);
    request.query('SELECT * FROM dbo.Usuario', (err, result) => {
        res.send(JSON.stringify(result.recordsets[0]));
    });
});

module.exports = router;