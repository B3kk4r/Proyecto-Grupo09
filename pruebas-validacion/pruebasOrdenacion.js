import assert from 'node:assert/strict';
import { mergeSort, quickSort } from '../src/ordenación.js';
import { crearComparador, estaOrdenado } from '../src/comparadores.js';
import { generarDataset } from '../src/generarDataset.js';

let correctas = 0;
let fallidas = 0;

// Muestra el resultado y sigue con las demas pruebas.
function probar(nombre, prueba) {
    try {
        prueba();
        correctas++;
        console.log('OK:', nombre);
    } catch (error) {
        fallidas++;
        console.error('ERROR:', nombre, '-', error.message);
    }
}

// Extrae los ID para revisar el orden final.
function obtenerIds(registros) {
    const ids = [];

    for (const registro of registros) {
        ids.push(registro.id);
    }

    return ids;
}

// Revisa que no falten ni se repitan registros.
function verificarIntegridad(originales, ordenados) {
    assert.equal(ordenados.length, originales.length);

    const porId = new Map();

    for (const registro of originales) {
        assert.equal(porId.has(registro.id), false);
        porId.set(registro.id, registro);
    }

    for (const registro of ordenados) {
        assert.strictEqual(porId.get(registro.id), registro);
        porId.delete(registro.id);
    }

    assert.equal(porId.size, 0);
}

// Prueba el orden y la integridad con datos generados.
function validarDataset(ordenar, cantidad, semilla) {
    const datos = generarDataset(cantidad, semilla);
    const copiaOriginal = JSON.stringify(datos);
    const comparador = crearComparador();
    const resultado = ordenar(datos, comparador);

    assert.equal(estaOrdenado(resultado, comparador), true);
    verificarIntegridad(datos, resultado);
    assert.equal(JSON.stringify(datos), copiaOriginal);
    assert.notStrictEqual(resultado, datos);
}

// Estos datos tienen un orden esperado conocido.
const ejemplos = [
    { id: 4, producto: 'Tomate', categoria: 'Verduras', precio: 2.50 },
    { id: 5, producto: 'Manzana', categoria: 'Frutas', precio: 1.00 },
    { id: 2, producto: 'Tomate', categoria: 'Verduras', precio: 3.00 },
    { id: 7, producto: 'Arveja', categoria: 'Verduras', precio: 3.00 },
    { id: 1, producto: 'Tomate', categoria: 'Verduras', precio: 3.00 },
    { id: 9, producto: 'Pera', categoria: 'Frutas', precio: 2.00 }
];

const algoritmos = [
    { nombre: 'MergeSort', ordenar: mergeSort },
    { nombre: 'QuickSort', ordenar: quickSort }
];

// Ejecuta los mismos casos para los dos algoritmos.
for (const algoritmo of algoritmos) {
    console.log('\n=== ' + algoritmo.nombre + ' ===');

    probar('Arreglo vacio', function () {
        assert.deepStrictEqual(algoritmo.ordenar([]), []);
    });

    probar('Un elemento', function () {
        assert.deepStrictEqual(algoritmo.ordenar([7]), [7]);
    });

    probar('Negativos, cero y repetidos', function () {
        assert.deepStrictEqual(
            algoritmo.ordenar([3, -2, 0, 3, -5]),
            [-5, -2, 0, 3, 3]
        );
    });

    probar('Arreglo ya ordenado', function () {
        assert.deepStrictEqual(
            algoritmo.ordenar([1, 2, 3, 4]),
            [1, 2, 3, 4]
        );
    });

    probar('Arreglo en orden inverso', function () {
        assert.deepStrictEqual(
            algoritmo.ordenar([4, 3, 2, 1]),
            [1, 2, 3, 4]
        );
    });

    probar('Ordenamiento multicriterio', function () {
        const resultado = algoritmo.ordenar(
            ejemplos, crearComparador()
        );

        assert.deepStrictEqual(
            obtenerIds(resultado),
            [9, 5, 7, 1, 2, 4]
        );
    });

    probar('Criterio personalizado: precio ASC e ID ASC', function () {
        const comparador = crearComparador([
            { campo: 'precio', orden: 'asc' },
            { campo: 'id', orden: 'asc' }
        ]);

        const resultado = algoritmo.ordenar(ejemplos, comparador);

        assert.deepStrictEqual(
            obtenerIds(resultado),
            [5, 9, 4, 1, 2, 7]
        );
    });

    probar('No modifica el arreglo ni los registros originales', function () {
        const antes = JSON.stringify(ejemplos);
        const resultado = algoritmo.ordenar(
            ejemplos, crearComparador()
        );

        assert.equal(JSON.stringify(ejemplos), antes);
        assert.notStrictEqual(resultado, ejemplos);
    });

    probar('1000 registros agricolas sin perdidas ni cambios', function () {
        validarDataset(algoritmo.ordenar, 1000, 2026);
    });

    probar('10000 registros agricolas con otra semilla', function () {
        validarDataset(algoritmo.ordenar, 10000, 47);
    });
}

probar('El validador acepta el orden correcto', function () {
    const ordenados = [
        ejemplos[5], ejemplos[1], ejemplos[3],
        ejemplos[4], ejemplos[2], ejemplos[0]
    ];

    assert.equal(
        estaOrdenado(ordenados, crearComparador()),
        true
    );
});

probar('El validador detecta precios mal ordenados', function () {
    const incorrectos = [
        { id: 1, categoria: 'Frutas', precio: 1, producto: 'Pera' },
        { id: 2, categoria: 'Frutas', precio: 3, producto: 'Pera' }
    ];

    assert.equal(
        estaOrdenado(incorrectos, crearComparador()),
        false
    );
});

probar('El validador detecta IDs mal ordenados en un empate', function () {
    const incorrectos = [
        { id: 3, categoria: 'Frutas', precio: 2, producto: 'Pera' },
        { id: 1, categoria: 'Frutas', precio: 2, producto: 'Pera' }
    ];

    assert.equal(
        estaOrdenado(incorrectos, crearComparador()),
        false
    );
});

probar('MergeSort es estable cuando hay empates', function () {
    const datos = [
        { id: 1, precio: 2 },
        { id: 2, precio: 1 },
        { id: 3, precio: 2 },
        { id: 4, precio: 1 }
    ];

    const resultado = mergeSort(datos, function (a, b) {
        return a.precio - b.precio;
    });

    assert.deepStrictEqual(
        obtenerIds(resultado),
        [2, 4, 1, 3]
    );
});

probar('Ambos algoritmos coinciden con los cuatro criterios', function () {
    const datos = generarDataset(2000, 2026);
    const comparador = crearComparador();

    const resultadoMerge = mergeSort(datos, comparador);
    const resultadoQuick = quickSort(datos, comparador);

    assert.deepStrictEqual(
        obtenerIds(resultadoMerge),
        obtenerIds(resultadoQuick)
    );
});

// Muestra tres productos antes y despues de ordenar.
probar('Demostracion por precio ascendente', function () {
    const catalogo = generarDataset(10);
    const datos = [catalogo[8], catalogo[0], catalogo[5]];

    const comparadorPrecio = crearComparador([
        { campo: 'precio', orden: 'asc' }
    ]);

    const resultadoMerge = mergeSort(datos, comparadorPrecio);
    const resultadoQuick = quickSort(datos, comparadorPrecio);

    const idsEsperados = [6, 9, 1];

    assert.deepStrictEqual(obtenerIds(resultadoMerge), idsEsperados);
    assert.deepStrictEqual(obtenerIds(resultadoQuick), idsEsperados);

    assert.equal(estaOrdenado(resultadoMerge, comparadorPrecio), true);
    assert.equal(estaOrdenado(resultadoQuick, comparadorPrecio), true);

    console.log('\n=== DEMOSTRACION: PRECIO ASCENDENTE ===');

    console.log('ANTES:');
    console.table(datos);

    console.log('DESPUES - MergeSort:');
    console.table(resultadoMerge);

    console.log('DESPUES - QuickSort:');
    console.table(resultadoQuick);
});

// Resumen final.
console.log('\n=== RESUMEN DE VALIDACION ===');
console.log('Pruebas correctas:', correctas);
console.log('Pruebas fallidas:', fallidas);
console.log('Total de pruebas:', correctas + fallidas);

if (fallidas > 0) {
    process.exitCode = 1;
}
