
// PROYECTO GRUPO 9
// MODULO DE ORDENAMIENTO AVANZADO
// DATOS DE PRUEBA
//
///ESTRUCTURA DE DATOS (Integración del módulo de ordenamiento avanzado en el proyecto grupal)
///

// En esta parte creo los datos que vamos a utilizar
// para probar los algoritmos MergeSort y QuickSort.

// Primero establezco un catalogo de productos agricolas.
// Los nombres son referencias de productos comerciales.
// Los precios y cantidades son datos de ejemplo.

export const CATALOGO_BASE = [
    {
        producto: 'Aguacate Fuerte',
        categoria: 'Frutas',
        precio: 1.50,
        cantidad: 20,
        tienda: 'Gran Ak\u00ed'
    },
    {
        producto: 'Baby Manzanas',
        categoria: 'Frutas',
        precio: 2.50,
        cantidad: 15,
        tienda: 'Zerimar'
    },
    {
        producto: 'Lim\u00f3n Mandarina',
        categoria: 'Frutas',
        precio: 1.20,
        cantidad: 30,
        tienda: 'Gran Ak\u00ed'
    },
    {
        producto: 'Naranjilla Fresca',
        categoria: 'Frutas',
        precio: 1.80,
        cantidad: 24,
        tienda: 'Gran Ak\u00ed'
    },
    {
        producto: 'Arvejas Frescas',
        categoria: 'Legumbres',
        precio: 1.75,
        cantidad: 40,
        tienda: 'Supermaxi'
    },
    {
        producto: 'Cebolla Larga Fresca',
        categoria: 'Verduras',
        precio: 0.85,
        cantidad: 18,
        tienda: 'Supermaxi'
    },
    {
        producto: 'Lechuga Crespa Fresca',
        categoria: 'Verduras',
        precio: 1.00,
        cantidad: 12,
        tienda: 'Supermaxi'
    },
    {
        producto: 'Baby Tomate',
        categoria: 'Hortalizas',
        precio: 1.50,
        cantidad: 35,
        tienda: 'Zerimar'
    },
    {
        producto: 'Tomate Ri\u00f1\u00f3n Fresco',
        categoria: 'Hortalizas',
        precio: 1.40,
        cantidad: 28,
        tienda: 'Supermaxi'
    },
    {
        producto: 'Pl\u00e1tano Verde Fresco',
        categoria: 'Pl\u00e1tanos y bananos',
        precio: 1.25,
        cantidad: 10,
        tienda: 'Supermaxi'
    }
];

// Creo una funcion para generar numeros aleatorios.
// Utilizo una semilla para que los resultados se puedan
// repetir y comparar con los algoritmos de ordenamiento.

function crearAleatorio(semilla) {

    let estado = semilla >>> 0;

    return function () {
        estado = (Math.imul(1664525, estado) + 1013904223) >>> 0;

        return estado / 4294967296;
    };
}

// Esta funcion genera los registros que necesitemos.
// Recibe la cantidad total y una semilla opcional.

export function generarDataset(total, semilla = 2026) {

    // Primero compruebo que la cantidad ingresada sea valida.

    if (!Number.isSafeInteger(total) || total < 0) {
        throw new Error('La cantidad debe ser un entero mayor o igual a 0');
    }

    if (!Number.isSafeInteger(semilla)) {
        throw new Error('La semilla debe ser un numero entero');
    }

    // Creo el generador de numeros.
    const aleatorio = crearAleatorio(semilla);

    // En este arreglo voy a guardar todos los registros.
    const registros = [];

    // Repito el proceso hasta completar los registros.

    for (let i = 0; i < total; i++) {

        // Conservo los primeros 10 registros del catalogo.
        // Despues selecciono productos de manera aleatoria.

        let productoBase;

        if (i < CATALOGO_BASE.length) {
            productoBase = CATALOGO_BASE[i];
        } else {
            const posicion = Math.floor(
                aleatorio() * CATALOGO_BASE.length
            );

            productoBase = CATALOGO_BASE[posicion];
        }

        // Genero precios con una variacion maxima del 15%.
        // Trabajo con centavos para evitar problemas
        // con los decimales.

        const precioMinimo = Math.ceil(
            productoBase.precio * 0.85 * 100 - 1e-9
        );

        const precioMaximo = Math.floor(
            productoBase.precio * 1.15 * 100 + 1e-9
        );

        let precio;
        let cantidad;

        if (i < CATALOGO_BASE.length) {

            // Mantengo los datos originales del catalogo.
            precio = productoBase.precio;
            cantidad = productoBase.cantidad;

        } else {

            // Genero un precio dentro del rango permitido.
            const precioCentavos = precioMinimo + Math.floor(
                aleatorio() * (precioMaximo - precioMinimo + 1)
            );

            precio = precioCentavos / 100;

            // Genero una cantidad diferente para cada registro.
            // Evito cantidades negativas o iguales a cero.

            cantidad = Math.max(
                1,
                Math.round(
                    productoBase.cantidad * (0.80 + aleatorio() * 0.40)
                )
            );
        }

        // Creo un registro con todos los campos necesarios.
        const registro = {
            id: i + 1,
            producto: productoBase.producto,
            categoria: productoBase.categoria,
            precio: precio,
            cantidad: cantidad,
            tienda: productoBase.tienda
        };

        // Agrego el registro al arreglo principal.
        registros.push(registro);
    }

    // Devuelvo los registros para que mis companeros
    // puedan utilizarlos con MergeSort y QuickSort.

    return registros;
}
