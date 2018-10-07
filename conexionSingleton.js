const configuracion = require('./configuracionSql');
const sql = require('mssql');
const color = require('cli-color');

const conexion = new sql.ConnectionPool({
    user: configuracion.Usuario,
    password: configuracion.Password,
    server: configuracion.Servidor,
    database: configuracion.NombreBaseDatos
});

conexion.connect(error => {
    if (!error){
        console.log(color.greenBright('Conectado a la base de datos ' + configuracion.Servidor));
    } else {
        console.error(color.red('Error al conectarse a la base de datos: '+error));
    }
});

module.exports = conexion;