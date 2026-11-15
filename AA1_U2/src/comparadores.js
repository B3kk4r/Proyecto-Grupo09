// Define los criterios que se aplicaran por defecto.
// asc: orden ascendente (A-Z o menor a mayor).
// desc: orden descendente (Z-A o mayor a menor).
export const CRITERIOS_POR_DEFECTO = [
    { campo: 'categoria', orden: 'asc' }, // Categoria alfabeticamente.
    { campo: 'precio', orden: 'desc' },    // Precio de mayor a menor.
    { campo: 'producto', orden: 'asc' },   // Producto alfabeticamente.
    { campo: 'id', orden: 'asc' }          // ID de menor a mayor.
];

// Compara dos valores para determinar su orden.
// Si ambos son numeros, realiza una comparacion numerica.
// Si son textos, los compara alfabeticamente en español.
function compararValores(a, b) {

    if (typeof a === 'number' && typeof b === 'number') {
        return a - b;
    }

    return String(a).localeCompare(String(b), 'es');
}

// Crea una funcion comparadora a partir de los criterios recibidos.
// Si no se indican criterios, utiliza CRITERIOS_POR_DEFECTO.
export function crearComparador(criterios = CRITERIOS_POR_DEFECTO) {

    return function (a, b) {

        // Recorre los criterios en el orden establecido.
        for (const criterio of criterios) {

            const campo = criterio.campo;
            const orden = criterio.orden;

            // Compara el mismo campo de los dos productos.
            const resultado = compararValores(a[campo], b[campo]);

            // Si los valores son diferentes, determina su orden.
            if (resultado !== 0) {

                // Invierte el resultado si el orden es descendente.
                if (orden === 'desc') {
                    return -resultado;
                }

                // Mantiene el resultado si el orden es ascendente.
                return resultado;
            }
        }

        // Si todos los campos coinciden, los productos son equivalentes.
        return 0;
    };
}

// Verifica si un arreglo ya esta ordenado correctamente.

export function estaOrdenado(arreglo, comparador = crearComparador()) {

    // Comienza desde el segundo elemento del arreglo.
    for (let i = 1; i < arreglo.length; i++) {

        // Compara cada elemento con el anterior.
        // Si estan en el orden incorrecto, devuelve false.
        if (comparador(arreglo[i - 1], arreglo[i]) > 0) {
            return false;
        }
    }

    // Si no encuentra errores, el arreglo esta ordenado.
    return true;
}
