
import test from 'node:test';
import assert from 'node:assert/strict';
import { Heap, MinHeap, MaxHeap } from '../src/heaps.js';

// Datos de prueba de productos agricolas.
const productos = [
    { id: 1, producto: 'Aguacate', precio: 1.50 },
    { id: 2, producto: 'Tomate', precio: 1.25 },
    { id: 3, producto: 'Cebolla', precio: 0.90 },
    { id: 4, producto: 'Papa', precio: 2.00 }
];

const compararPrecios = (a, b) => a.precio - b.precio;

test('El Min-Heap inicia vacio', () => {
    const heap = new MinHeap();

    assert.equal(heap.estaVacio(), true);
    assert.equal(heap.obtenerCantidad(), 0);
    assert.equal(heap.obtenerRaiz(), null);
    assert.equal(heap.extraerRaiz(), null);
});

test('El Max-Heap inicia vacio', () => {
    const heap = new MaxHeap();

    assert.equal(heap.estaVacio(), true);
    assert.equal(heap.obtenerRaiz(), null);
    assert.equal(heap.extraerRaiz(), null);
});

test('El Min-Heap conserva el menor numero en la raiz', () => {
    const heap = new MinHeap();

    for (const numero of [8, 3, 10, 1, 6]) {
        heap.insertar(numero);
    }

    assert.equal(heap.obtenerRaiz(), 1);
    assert.equal(heap.obtenerCantidad(), 5);
    assert.equal(heap.esValido(), true);
});

test('El Max-Heap conserva el mayor numero en la raiz', () => {
    const heap = new MaxHeap();

    for (const numero of [8, 3, 10, 1, 6]) {
        heap.insertar(numero);
    }

    assert.equal(heap.obtenerRaiz(), 10);
    assert.equal(heap.obtenerCantidad(), 5);
    assert.equal(heap.esValido(), true);
});

test('El Min-Heap extrae los numeros de menor a mayor', () => {
    const heap = new MinHeap();
    heap.construir([7, 2, 9, 1, 4]);

    const resultado = [];

    while (!heap.estaVacio()) {
        resultado.push(heap.extraerRaiz());
        assert.equal(heap.esValido(), true);
    }

    assert.deepEqual(resultado, [1, 2, 4, 7, 9]);
});

test('El Max-Heap extrae los numeros de mayor a menor', () => {
    const heap = new MaxHeap();
    heap.construir([7, 2, 9, 1, 4]);

    const resultado = [];

    while (!heap.estaVacio()) {
        resultado.push(heap.extraerRaiz());
        assert.equal(heap.esValido(), true);
    }

    assert.deepEqual(resultado, [9, 7, 4, 2, 1]);
});

test('El Heap permite numeros negativos, cero y repetidos', () => {
    const heap = new MinHeap();
    heap.construir([0, -3, 5, -3, 0]);

    const resultado = [];

    while (!heap.estaVacio()) {
        resultado.push(heap.extraerRaiz());
    }

    assert.deepEqual(resultado, [-3, -3, 0, 0, 5]);
});

test('Construir el Heap no modifica el arreglo recibido', () => {
    const numeros = [4, 8, 1, 3, 6];
    const copiaOriginal = [...numeros];
    const heap = new MinHeap();

    heap.construir(numeros);

    assert.deepEqual(numeros, copiaOriginal);
    assert.equal(heap.obtenerRaiz(), 1);
    assert.equal(heap.esValido(), true);
});

test('Obtener los elementos devuelve una copia del arreglo', () => {
    const heap = new MaxHeap();
    heap.construir([2, 4, 1]);

    const copia = heap.obtenerElementos();
    copia[0] = 999;

    assert.equal(heap.obtenerRaiz(), 4);
    assert.equal(heap.esValido(), true);
});

test('El Min-Heap organiza productos por el precio mas bajo', () => {
    const heap = new MinHeap(compararPrecios);
    heap.construir(productos);

    assert.equal(heap.obtenerRaiz().producto, 'Cebolla');

    assert.deepEqual(
        [
            heap.extraerRaiz().precio,
            heap.extraerRaiz().precio,
            heap.extraerRaiz().precio,
            heap.extraerRaiz().precio
        ],
        [0.90, 1.25, 1.50, 2.00]
    );
});

test('El Max-Heap organiza productos por el precio mas alto', () => {
    const heap = new MaxHeap(compararPrecios);
    heap.construir(productos);

    assert.equal(heap.obtenerRaiz().producto, 'Papa');

    assert.deepEqual(
        [
            heap.extraerRaiz().precio,
            heap.extraerRaiz().precio,
            heap.extraerRaiz().precio,
            heap.extraerRaiz().precio
        ],
        [2.00, 1.50, 1.25, 0.90]
    );
});

test('Insercion y extraccion mantienen la propiedad del Heap', () => {
    const heap = new MaxHeap();

    heap.insertar(12);
    heap.insertar(5);
    heap.insertar(20);

    assert.equal(heap.extraerRaiz(), 20);

    heap.insertar(15);

    assert.equal(heap.obtenerRaiz(), 15);
    assert.equal(heap.obtenerCantidad(), 3);
    assert.equal(heap.esValido(), true);
});

test('Se puede reconstruir un Heap con otros datos', () => {
    const heap = new MinHeap();

    heap.construir([9, 3, 6]);
    heap.construir([8, 2]);

    assert.equal(heap.obtenerCantidad(), 2);
    assert.equal(heap.extraerRaiz(), 2);
    assert.equal(heap.extraerRaiz(), 8);
});

test('El Heap valida el tipo y el comparador', () => {
    assert.throws(() => new Heap('otro'), /tipo de Heap/);
    assert.throws(() => new Heap('min', 'comparador'), /comparador/);
    assert.throws(() => new MinHeap().construir('datos'), /arreglo/);
});

test('La validacion detecta cuando se rompe el orden del Heap', () => {
    const heap = new MaxHeap();
    heap.construir([8, 5, 3]);

    heap.elementos[0] = 1;

    assert.equal(heap.esValido(), false);
});

test('El Heap soporta un conjunto amplio de datos', () => {
    const heap = new MinHeap();
    const numeros = [];

    for (let numero = 10000; numero >= 1; numero--) {
        numeros.push(numero);
    }

    heap.construir(numeros);

    assert.equal(heap.obtenerCantidad(), 10000);
    assert.equal(heap.esValido(), true);

    for (let numero = 1; numero <= 10000; numero++) {
        assert.equal(heap.extraerRaiz(), numero);
    }

    assert.equal(heap.estaVacio(), true);
});
