const express = require('express');
const router = express.Router();
const sql = require('mssql');
const singleton = require('../utiles/conexionSingleton');
const util = require('../utiles/utilesBaseDeDatos');

router.get('/', (req, res, next) => {
    const peticion = new sql.Request(singleton());
    util.ejecutarConsultaSql(`SELECT * FROM tablaQueNoExiste`, peticion, [],
        (filas) => {
            res.send({Usuarios: filas});
        },
        (error) => {
            res.send({Error: error});
        });
});

module.exports = router;