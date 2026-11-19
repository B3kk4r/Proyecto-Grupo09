// Busqueda binaria por ID, en un arreglo en memoria y en un archivo indexado.
// Parte de @dannybeltran-sketch - Avance 2, Unidad 2 (Estructura de Datos, UNL).
//
// REQUISITO: los registros deben estar ORDENADOS ASCENDENTEMENTE por id
// (ver estaOrdenadoPorId en prepararDatosBusqueda.js).
//
// CRITERIO DE CONTEO (igual que busquedaSecuencial.js):
// cada registro que se examina cuenta como UNA comparacion de su id con idBuscado.
// Asi, secuencial y binaria se pueden comparar con la misma unidad.
// En el peor caso la binaria hace floor(log2(n)) + 1 comparaciones.

// Nucleo comun: recibe la cantidad de registros y una funcion que devuelve el registro
// de la posicion i. Con esto el arreglo y el archivo comparten exactamente el mismo algoritmo.
function buscarBinario(total, obtenerRegistro, idBuscado) {
    let comparaciones = 0;
    let inicio = 0;
    let fin = total - 1;

    while (inicio <= fin) {
        // Posicion central del rango que todavia puede contener el id.
        const medio = Math.floor((inicio + fin) / 2);
        const registro = obtenerRegistro(medio);
        comparaciones++;

        if (registro.id === idBuscado) {
            return { registro, comparaciones };
        }

        // Si el id del centro es menor, el buscado esta en la mitad derecha;
        // si es mayor, esta en la mitad izquierda. Se descarta la otra mitad.
        if (registro.id < idBuscado) {
            inicio = medio + 1;
        } else {
            fin = medio - 1;
        }
    }

    return { registro: null, comparaciones };
}

// Busca un registro por ID en un arreglo ordenado por id.
// Devuelve { registro: {...} | null, comparaciones: n }.
export function buscarBinarioArreglo(registros, idBuscado) {
    return buscarBinario(registros.length, (i) => registros[i], idBuscado);
}

// Busca un registro por ID en un archivo indexado, ordenado por id.
// Recibe el objeto que devuelve abrirArchivo(ruta) de archivoIndexado.js
// (el indice se construye una sola vez y se reutiliza en todas las busquedas).
// En cada paso lee UN solo registro del disco por su posicion en bytes;
// nunca carga el archivo completo en memoria.
// Devuelve { registro: {...} | null, comparaciones: n }.
export function buscarBinarioArchivo(archivo, idBuscado) {
    if (!archivo || typeof archivo.leerPorIndice !== 'function' || !Number.isInteger(archivo.total)) {
        throw new TypeError(
            'buscarBinarioArchivo necesita el objeto devuelto por abrirArchivo(ruta), no la ruta del archivo.'
        );
    }

    return buscarBinario(archivo.total, (i) => archivo.leerPorIndice(i), idBuscado);
}
