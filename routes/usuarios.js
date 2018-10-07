const express = require('express');
const router = express.Router();
const sql = require('mssql');
const singleton = require('../conexionSingleton');

/* GET users listing. */
router.get('/', function (req, res, next) {
    const request = new sql.Request(singleton);
    const consulta = `
    SELECT (
    
    -----------
    SELECT 
    U.Nombre,
    U.ClaveEncriptada,
    U.Email,
    (SELECT T.Token FROM dbo.TOKEN T WHERE T.Usuario_Nombre = U.Nombre FOR JSON PATH) AS Tokens
    FROM dbo.Usuario U 
    -----------
    
    FOR JSON PATH) AS Json
    `; //TODO: Hacer que la conversion de la consulta la haga un helper, y el JSON.parse raro tambien
    request.query(consulta, (err, result) => {
        res.send(JSON.parse(result.recordsets[0][0].Json));
    });
});

module.exports = router;