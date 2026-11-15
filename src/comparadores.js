// Criterios de ordenacion de productos agricolas


export const CRITERIOS_POR_DEFECTO = [
    { campo: 'categoria', orden: 'asc' },
    { campo: 'precio', orden: 'desc' },
    { campo: 'producto', orden: 'asc' },
    { campo: 'id', orden: 'asc' }
];


function compararValores(a, b) {

    if (typeof a === 'number' && typeof b === 'number') {
        return a - b;
    }

    return String(a).localeCompare(String(b), 'es');
}


export function crearComparador(criterios = CRITERIOS_POR_DEFECTO) {

    return function (a, b) {

        for (const criterio of criterios) {

            const campo = criterio.campo;
            const orden = criterio.orden;

            const resultado = compararValores(a[campo], b[campo]);

            if (resultado !== 0) {

                if (orden === 'desc') {
                    return -resultado;
                }

                return resultado;
            }
        }

        return 0;
    };
}


export function estaOrdenado(arreglo, comparador = crearComparador()) {

    for (let i = 1; i < arreglo.length; i++) {

        if (comparador(arreglo[i - 1], arreglo[i]) > 0) {
            return false;
        }
    }

    return true;
}
