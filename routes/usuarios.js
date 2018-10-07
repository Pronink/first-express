const express = require('express');
const router = express.Router();
const sql = require('mssql');
const singleton = require('../conexionSingleton');
const util = require('../utiles');


router.get('/', (req, res, next) => {
    const peticion = new sql.Request(singleton);
    peticion.execute('dbo.UsuariosSEL', (err, result) => {
        result = util.prepararResultado(result, ['Tokens']);
        res.send({Usuarios: result.Filas});
    });
});


router.get('/:nombre', (req, res, next) => {
    const peticion = new sql.Request(singleton);
    peticion.input('nombre', sql.NVarChar(50), req.params['nombre']);
    peticion.output('fechaActual', sql.BigInt());
    peticion.execute('dbo.UsuarioSEL', (err, result) => {
        result = util.prepararResultado(result, ['Tokens']);
        res.send({Usuario: result.Filas[0], Fecha: result.Salida['fechaActual']});
    });
});

module.exports = router;