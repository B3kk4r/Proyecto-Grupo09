import test from 'node:test';
import assert from 'node:assert/strict';
import { MinHeap, MaxHeap } from '../src/heaps.js';
import { mergeSort, quickSort } from '../../AA1_U2/src/ordenación.js';
import { crearComparador, estaOrdenado } from '../../AA1_U2/src/comparadores.js';
import { buscarSecuencialArreglo } from '../../AA2_U2/busquedaSecuencial.js';
import { buscarBinarioArreglo, buscarBinarioArchivo } from '../../AA2_U2/busquedaBinaria.js';
import { abrirArchivo } from '../../AA2_U2/archivoIndexado.js';
import { buscarSecuencialArchivo } from '../../AA2_U2/busquedaSecuencial.js';

import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// H01: Verificar un Heap vacío.
test('H01 - Min-Heap vacío', () => {
    const heap = new MinHeap();

    assert.equal(heap.estaVacio(), true);
    assert.equal(heap.obtenerRaiz(), null);
    assert.equal(heap.obtenerCantidad(), 0);
});

// H02: Verificar que el menor elemento quede en la raíz.
test('H02 - Inserción en Min-Heap', () => {
    const heap = new MinHeap();

    for (const numero of [8, 3, 10, 1, 6]) {
        heap.insertar(numero);
    }

    assert.equal(heap.obtenerRaiz(), 1);
    assert.equal(heap.esValido(), true);
});

// H03: Verificar que el mayor elemento quede en la raíz.
test('H03 - Inserción en Max-Heap', () => {
    const heap = new MaxHeap();

    for (const numero of [8, 3, 10, 1, 6]) {
        heap.insertar(numero);
    }

    assert.equal(heap.obtenerRaiz(), 10);
    assert.equal(heap.esValido(), true);
});

// H04: Verificar números negativos y repetidos.
test('H04 - Valores negativos y repetidos', () => {
    const heap = new MinHeap();

    heap.construir([0, -3, 5, -3, 0]);

    const resultado = [];

    while (!heap.estaVacio()) {
        resultado.push(heap.extraerRaiz());
    }

    assert.deepEqual(resultado, [-3, -3, 0, 0, 5]);
});

 // ==================== ORDENAMIENTO ====================

// O01: Arreglos vacíos.
test('O01 - Ordenamiento de arreglo vacío', () => {
    assert.deepEqual(mergeSort([]), []);
    assert.deepEqual(quickSort([]), []);
});

// O02: Arreglos de un elemento.
test('O02 - Ordenamiento de un elemento', () => {
    assert.deepEqual(mergeSort([5]), [5]);
    assert.deepEqual(quickSort([5]), [5]);
});

// O03: MergeSort con números desordenados.
test('O03 - MergeSort ordena números', () => {
    const resultado = mergeSort([8, 3, 10, 1, 6]);

    assert.deepEqual(resultado, [1, 3, 6, 8, 10]);
});

// O04: QuickSort con números desordenados.
test('O04 - QuickSort ordena números', () => {
    const resultado = quickSort([8, 3, 10, 1, 6]);

    assert.deepEqual(resultado, [1, 3, 6, 8, 10]);
});

// O05: Números negativos, cero y repetidos.
test('O05 - Ordenamiento de valores repetidos y negativos', () => {
    const datos = [0, -3, 5, -3, 0];
    const esperado = [-3, -3, 0, 0, 5];

    assert.deepEqual(mergeSort(datos), esperado);
    assert.deepEqual(quickSort(datos), esperado);
});

// O06: Arreglo en orden inverso.
test('O06 - Ordenamiento de arreglo invertido', () => {
    const datos = [9, 7, 5, 3, 1];
    const esperado = [1, 3, 5, 7, 9];

    assert.deepEqual(mergeSort(datos), esperado);
    assert.deepEqual(quickSort(datos), esperado);
});

// Datos agrícolas para las siguientes pruebas.
const productosOrdenamiento = [
    { id: 4, categoria: 'Hortaliza', precio: 2, producto: 'Tomate' },
    { id: 3, categoria: 'Fruta', precio: 1, producto: 'Mango' },
    { id: 2, categoria: 'Fruta', precio: 3, producto: 'Pera' },
    { id: 1, categoria: 'Fruta', precio: 3, producto: 'Manzana' },
    { id: 5, categoria: 'Fruta', precio: 3, producto: 'Manzana' }
];

// O07: Ordenamiento con los criterios del proyecto.
test('O07 - Ordenamiento multicriterio', () => {
    const comparador = crearComparador();

    const merge = mergeSort(productosOrdenamiento, comparador);
    const quick = quickSort(productosOrdenamiento, comparador);

    assert.deepEqual(merge.map(p => p.id), [1, 5, 2, 3, 4]);
    assert.deepEqual(quick.map(p => p.id), [1, 5, 2, 3, 4]);

    assert.equal(estaOrdenado(merge, comparador), true);
    assert.equal(estaOrdenado(quick, comparador), true);
});

// O08: Ordenamiento por precio ascendente e ID.
test('O08 - Ordenamiento con criterios personalizados', () => {
    const comparador = crearComparador([
        { campo: 'precio', orden: 'asc' },
        { campo: 'id', orden: 'asc' }
    ]);

    const merge = mergeSort(productosOrdenamiento, comparador);
    const quick = quickSort(productosOrdenamiento, comparador);

    assert.deepEqual(merge.map(p => p.id), [3, 4, 1, 2, 5]);
    assert.deepEqual(quick.map(p => p.id), [3, 4, 1, 2, 5]);
});

// O09: Los algoritmos no deben modificar el arreglo original.
test('O09 - Conservar el arreglo original', () => {
    const datos = [5, 2, 8, 1];
    const copia = [...datos];

    mergeSort(datos);
    quickSort(datos);

    assert.deepEqual(datos, copia);
});

// O10: MergeSort conserva el orden de elementos equivalentes.
test('O10 - Estabilidad de MergeSort', () => {
    const datos = [
        { id: 1, precio: 5 },
        { id: 2, precio: 3 },
        { id: 3, precio: 5 }
    ];

    const resultado = mergeSort(datos, (a, b) => a.precio - b.precio);

    assert.deepEqual(resultado.map(p => p.id), [2, 1, 3]);
});

 // ==================== BÚSQUEDA ====================

const registrosBusqueda = [
    { id: 1, producto: 'Tomate' },
    { id: 2, producto: 'Cebolla' },
    { id: 3, producto: 'Papa' }
];

// B01: Buscar el primer registro.
test('B01 - Búsqueda secuencial al inicio', () => {
    const resultado = buscarSecuencialArreglo(registrosBusqueda, 1);

    assert.equal(resultado.registro.id, 1);
    assert.equal(resultado.comparaciones, 1);
});

// B02: Buscar un registro intermedio.
test('B02 - Búsqueda secuencial en el medio', () => {
    const resultado = buscarSecuencialArreglo(registrosBusqueda, 2);

    assert.equal(resultado.registro.id, 2);
    assert.equal(resultado.comparaciones, 2);
});

// B03: Buscar el último registro.
test('B03 - Búsqueda secuencial al final', () => {
    const resultado = buscarSecuencialArreglo(registrosBusqueda, 3);

    assert.equal(resultado.registro.id, 3);
    assert.equal(resultado.comparaciones, 3);
});

// B04: Buscar un ID inexistente.
test('B04 - Búsqueda secuencial sin coincidencia', () => {
    const resultado = buscarSecuencialArreglo(registrosBusqueda, 99);

    assert.equal(resultado.registro, null);
    assert.equal(resultado.comparaciones, 3);
});

// B05: Buscar en un arreglo vacío.
test('B05 - Búsqueda secuencial en arreglo vacío', () => {
    const resultado = buscarSecuencialArreglo([], 1);

    assert.equal(resultado.registro, null);
    assert.equal(resultado.comparaciones, 0);
});

 // ==================== BÚSQUEDA BINARIA ====================

// B06: Buscar el primer registro del arreglo.
test('B06 - Búsqueda binaria al inicio', () => {
    const resultado = buscarBinarioArreglo(registrosBusqueda, 1);

    assert.equal(resultado.registro.id, 1);
    assert.equal(resultado.comparaciones, 2);
});

// B07: Buscar el registro central.
test('B07 - Búsqueda binaria en el medio', () => {
    const resultado = buscarBinarioArreglo(registrosBusqueda, 2);

    assert.equal(resultado.registro.id, 2);
    assert.equal(resultado.comparaciones, 1);
});

// B08: Buscar el último registro.
test('B08 - Búsqueda binaria al final', () => {
    const resultado = buscarBinarioArreglo(registrosBusqueda, 3);

    assert.equal(resultado.registro.id, 3);
    assert.equal(resultado.comparaciones, 2);
});

// B09: Buscar un ID inexistente.
test('B09 - Búsqueda binaria sin coincidencia', () => {
    const resultado = buscarBinarioArreglo(registrosBusqueda, 99);

    assert.equal(resultado.registro, null);
    assert.equal(resultado.comparaciones, 2);
});

// B10: Buscar en un arreglo vacío.
test('B10 - Búsqueda binaria en arreglo vacío', () => {
    const resultado = buscarBinarioArreglo([], 1);

    assert.equal(resultado.registro, null);
    assert.equal(resultado.comparaciones, 0);
});

 // ================ BÚSQUEDA EN ARCHIVOS ================

// Crea un archivo temporal, realiza la búsqueda y lo elimina.
async function probarArchivo(registros, idBuscado) {
    const carpeta = await mkdtemp(join(tmpdir(), 'matriz-aa2-'));
    const ruta = join(carpeta, 'datos.jsonl');

    try {
        let contenido = '';

        for (const registro of registros) {
            contenido += JSON.stringify(registro) + '\n';
        }

        await writeFile(ruta, contenido, 'utf8');

        return await buscarSecuencialArchivo(ruta, idBuscado);
    } finally {
        await rm(carpeta, { recursive: true, force: true });
    }
}

// B11: Buscar el primer registro del archivo.
test('B11 - Búsqueda secuencial al inicio del archivo', async () => {
    const resultado = await probarArchivo(registrosBusqueda, 1);

    assert.equal(resultado.registro.id, 1);
    assert.equal(resultado.comparaciones, 1);
});

// B12: Buscar el último registro del archivo.
test('B12 - Búsqueda secuencial al final del archivo', async () => {
    const resultado = await probarArchivo(registrosBusqueda, 3);

    assert.equal(resultado.registro.id, 3);
    assert.equal(resultado.comparaciones, 3);
});

// B13: Buscar un ID inexistente en el archivo.
test('B13 - Búsqueda secuencial sin coincidencia en archivo', async () => {
    const resultado = await probarArchivo(registrosBusqueda, 99);

    assert.equal(resultado.registro, null);
    assert.equal(resultado.comparaciones, 3);
});

// B14: Buscar en un archivo vacío.
test('B14 - Búsqueda secuencial en archivo vacío', async () => {
    const resultado = await probarArchivo([], 1);

    assert.equal(resultado.registro, null);
    assert.equal(resultado.comparaciones, 0);
});

// ============ BÚSQUEDA BINARIA EN ARCHIVOS ============

// Crea un archivo indexado temporal y realiza la búsqueda.
async function probarBinarioIndexado(registros, idBuscado) {
    const carpeta = await mkdtemp(join(tmpdir(), 'matriz-binaria-'));
    const ruta = join(carpeta, 'datos.jsonl');
    let archivo = null;

    try {
        let contenido = '';

        for (let i = 0; i < registros.length; i++) {
            contenido += JSON.stringify(registros[i]);

            if (i < registros.length - 1) {
                contenido += '\n';
            }
        }

        await writeFile(ruta, contenido, 'utf8');

        archivo = abrirArchivo(ruta);
        return buscarBinarioArchivo(archivo, idBuscado);
    } finally {
        if (archivo !== null) {
            archivo.cerrar();
        }

        await rm(carpeta, { recursive: true, force: true });
    }
}

// B15: Buscar el primer registro del archivo.
test('B15 - Búsqueda binaria al inicio del archivo', async () => {
    const resultado = await probarBinarioIndexado(registrosBusqueda, 1);

    assert.equal(resultado.registro.id, 1);
    assert.equal(resultado.comparaciones, 2);
});

// B16: Buscar el registro central.
test('B16 - Búsqueda binaria en el medio del archivo', async () => {
    const resultado = await probarBinarioIndexado(registrosBusqueda, 2);

    assert.equal(resultado.registro.id, 2);
    assert.equal(resultado.comparaciones, 1);
});

// B17: Buscar el último registro.
test('B17 - Búsqueda binaria al final del archivo', async () => {
    const resultado = await probarBinarioIndexado(registrosBusqueda, 3);

    assert.equal(resultado.registro.id, 3);
    assert.equal(resultado.comparaciones, 2);
});

// B18: Buscar un ID inexistente.
test('B18 - Búsqueda binaria sin coincidencia en archivo', async () => {
    const resultado = await probarBinarioIndexado(registrosBusqueda, 99);

    assert.equal(resultado.registro, null);
    assert.equal(resultado.comparaciones, 2);
});

// B19: Buscar en un archivo vacío.
test('B19 - Búsqueda binaria en archivo vacío', async () => {
    const resultado = await probarBinarioIndexado([], 1);

    assert.equal(resultado.registro, null);
    assert.equal(resultado.comparaciones, 0);
});

// B20: Buscar en un archivo con un solo registro.
test('B20 - Búsqueda binaria con un registro', async () => {
    const datos = [{ id: 7, producto: 'Papa' }];
    const resultado = await probarBinarioIndexado(datos, 7);

    assert.equal(resultado.registro.id, 7);
    assert.equal(resultado.comparaciones, 1);
});

// B21: Verificar nombres con tildes y caracteres especiales.
test('B21 - Búsqueda binaria con caracteres UTF-8', async () => {
    const datos = [
        { id: 1, producto: 'Piña' },
        { id: 2, producto: 'Café' },
        { id: 3, producto: 'Ñame' }
    ];

    const resultado = await probarBinarioIndexado(datos, 3);

    assert.equal(resultado.registro.producto, 'Ñame');
    assert.equal(resultado.comparaciones, 2);
});

// B22: Buscar un ID inexistente entre 1000 registros.
test('B22 - Peor caso de búsqueda binaria en archivo', async () => {
    const datos = [];

    for (let i = 1; i <= 1000; i++) {
        datos.push({ id: i, producto: 'Producto ' + i });
    }

    const resultado = await probarBinarioIndexado(datos, 1001);

    assert.equal(resultado.registro, null);
    assert.equal(resultado.comparaciones, 10);
});




