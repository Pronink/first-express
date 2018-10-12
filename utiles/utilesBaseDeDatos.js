let util = {};

/**
 * Convierte los datos recibidos por el result de una ejecución de procedimiento almacenado
 * "request.execute('dbo.UsuariosSEL', (err, result) => {}" en un objeto listo para usar.
 * También soluciona un error que sucede en el parseo automático de columnas en formato JSON,
 * que por defecto las trae así: "Tokens":"[{\"Token\":\"abcde\"}]". Simplemente hay que pasar
 * en el segundo parámetro una lista con los nombres de las columnas que están en formato JSON
 * para que este script las transforme en un objeto javascript: "Tokens":[{"Token":"abcde","Caducidad":600000}]
 * Retorna un objeto con el siguiente formato:
 * {filas: [{}{}{}...], variablesDeSalida(si existen): {nombreValor: claveValor, nombreValor2: claveValor2, ...}}
 * @param {Object} result Objeto result del Callback de request.execute
 * @param {Array} [columnasJson] Array de strings con el nombre de las columnas de tipo JSON
 * @returns {Object}
 */
let prepararResultado = (result, columnasJson) => {
    let filas, variablesDeSalida; // Variables a devolver
    if (result.output) {
        variablesDeSalida = result.output;
    }
    result = result.recordsets[0]; // Obtengo el primer select que devuelve el procedimiento
    if (columnasJson && columnasJson.length > 0) { // Si tengo que formatear columnas en JSON
        filas = []; // Aqui guardo todos los resultados formateados
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
    } else {
        filas = result;
    }
    return {filas: filas, variablesDeSalida: variablesDeSalida};
};
/**
 *
 * @param nombreProcedimientoAlmacenado
 * @param peticion
 * @param columnasJson
 * @param onResultado
 * @param onError
 */
util.ejecutarProcedimientoAlmacenado = (nombreProcedimientoAlmacenado, peticion, columnasJson, onResultado, onError) => {
    let sinRespuesta = true;
    let autoDevolverError = setTimeout(() => { // Si el callback falla (error de conexion) entonces se devuelve algo.
        if (sinRespuesta) {
            onError({"Error": {"code": "ECONNCLOSED", "name": "ConnectionError"}}); // todo Crear gestor de errores
        }
    }, 20000);
    peticion.execute(nombreProcedimientoAlmacenado, (err, result) => { // Parseo las columnas en JSON y preparo los resultados
        clearTimeout(autoDevolverError); // Si este callback funciona, no quiero que se ejecute el setTimeOut
        if (result) {
            result = prepararResultado(result, columnasJson);
            onResultado(result.filas, result.variablesDeSalida); // Si fué bien, ejecuto el callback onResultado
        } else {
            onError(err); // todo Crear gestor de errores
        }
    });
};
/**
 *
 * @param consultaSql
 * @param peticion
 * @param columnasJson
 * @param onResultado
 * @param onError
 */
util.ejecutarConsultaSql = (consultaSql, peticion, columnasJson, onResultado, onError) => {
    let sinRespuesta = true;
    let autoDevolverError = setTimeout(() => { // Si el callback falla (error de conexion) entonces se devuelve algo.
        if (sinRespuesta) {
            onError({"Error": {"code": "ECONNCLOSED", "name": "ConnectionError"}}); // todo Crear gestor de errores
        }
    }, 20000);
    peticion.query(consultaSql, (err, result) => { // Parseo las columnas en JSON y preparo los resultados
        clearTimeout(autoDevolverError); // Si este callback funciona, no quiero que se ejecute el setTimeOut
        if (result) {
            result = prepararResultado(result, columnasJson);
            onResultado(result.filas); // Si fué bien, ejecuto el callback onResultado
        } else {
            onError(err); // todo Crear gestor de errores
        }
    });
};


module.exports = util;