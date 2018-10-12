const express = require('express');
const router = express.Router();
const sql = require('mssql');
const singleton = require('../utiles/conexionSingleton');
const util = require('../utiles/utilesBaseDeDatos');


router.get('/', (req, res, next) => {
    const peticion = new sql.Request(singleton());
    util.ejecutarProcedimientoAlmacenado('dbo.UsuariosSEL', peticion, ['Tokens'],
        (filas, variablesSalida) => {
            res.send({Usuarios: filas});
        },
        (error) => {
            res.send({Error: error});
        });
});


router.get('/:nombre', (req, res, next) => {
    const peticion = new sql.Request(singleton());
    peticion.input('nombre', sql.NVarChar(50), req.params['nombre']);
    peticion.output('fechaActual', sql.BigInt());
    util.ejecutarProcedimientoAlmacenado('dbo.UsuarioSEL', peticion, ['Tokens'],
        (filas, variablesSalida) => {
            res.send({Usuario: filas[0], Fecha: variablesSalida['fechaActual']});
        },
        (error) => {
            res.send({Error: error});
        });
});

module.exports = router;