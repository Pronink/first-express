let util = {};

/**
 * Convierte los datos recibidos por el result de una ejecución de procedimiento almacenado
 * "request.execute('dbo.UsuariosSEL', (err, result) => {}" en un objeto listo para usar.
 * También soluciona un error que sucede en el parseo automático de columnas en formato JSON,
 * que por defecto las trae así: "Tokens":"[{\"Token\":\"abcde\"}]". Simplemente hay que pasar
 * en el segundo parámetro una lista con los nombres de las columnas que están en formato JSON
 * para que este script las transforme en un objeto javascript: "Tokens":[{"Token":"abcde","Caducidad":600000}]
 * Retorna un objeto con el siguiente formato:
 * {Filas: [{}{}{}...], Salida(opcional): {nombreValor: claveValor, nombreValor2: claveValor2, ...}}
 * @param result
 * @param {Array} [columnasJson]
 * @returns {Object}
 */
util.prepararResultado = (result, columnasJson) => {
    let resultado = {};
    if (result.output) {
        resultado['Salida'] = result.output;
    }
    result = result.recordsets[0]; // Obtengo el primer select que devuelve el procedimiento
    let filas = []; // Aqui guardo todos los resultados formateados
    result.forEach((fila) => { // Recorro las filas recibidas de SQL
        columnasJson.forEach((columnaJson) => { // Recorro que columnas son listas en JSON para formatearlas
            if (fila[columnaJson] !== null) {
                fila[columnaJson] = JSON.parse(fila[columnaJson]);
            } else {
                fila[columnaJson] = []; // Convierto el null que trae la base de datos en una lista vacia
            }
        });
        filas.push(fila); // Agrego la fila a la lista de filas formateadas
    });
    resultado['Filas'] = filas;
    return resultado;
};

module.exports = util;