const configuracion = require('../configuracionSql');
const sql = require('mssql');
const color = require('cli-color');

let conexion;
let conectado = false;

function intentarConexion() {
    conexion = new sql.ConnectionPool({
        user: configuracion.Usuario,
        password: configuracion.Password,
        server: configuracion.Servidor,
        database: configuracion.NombreBaseDatos,
        options: {
            encrypt: true
        }
    });
    conexion.connect(error => {
        if (!error) {
            // Si la conexión ha sido satisfactoria
            console.log(color.greenBright('Conectado a la base de datos ' + configuracion.Servidor));
            conectado = true; // Así permito recibir errores
        } else {
            // Se ejecuta cuando se intenta iniciar sesion en la base de datos y no responde o falla
            console.error(color.red('Error al conectarse a la base de datos: ' + color.red.bold(error)));
            console.error(color.red('Reintentando en 10 segundos ...'));
            setTimeout(() => {
                console.log(color.yellow('Reintentando conectarse a la base de datos ' + configuracion.Servidor));
                intentarConexion();
            }, 10000);
        }
    });
    // Se ejecuta cuando se hace una consulta y la base de datos no responde
    conexion.on('error', error => {
        if (conectado) { // Cuando falla ejecuta el evento continuamente
            console.error(color.red('Error al conectarse a la base de datos: ' + color.red.bold(error)));
            console.error(color.red('Reintentando en 3 segundos ...'));
            setTimeout(() => {
                console.log(color.yellow('Reintentando conectarse a la base de datos ' + configuracion.Servidor));
                intentarConexion();
            }, 3000);
        }
        conectado = false; // asi que solo dejo que el error salte una vez e intento arreglarlo
    });
}

console.log(color.yellow('Conectando a la base de datos ' + configuracion.Servidor + ' ...'));
intentarConexion();

/**
 * Devuelve la referencia de la conexión actualizada.
 * @returns {*}
 */
function getConexion() {
    return conexion;
}

module.exports = getConexion;