// Pruebas de validacion de la busqueda binaria (arreglo y archivo).
// Ejecutar desde la raiz del proyecto:  node pruebas-validacion/pruebasBusquedaBinaria.js
import assert from 'node:assert/strict';
import { writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { buscarBinarioArreglo, buscarBinarioArchivo } from '../busquedaBinaria.js';
import { buscarSecuencialArreglo } from '../busquedaSecuencial.js';
import { abrirArchivo } from '../archivoIndexado.js';
import { generarDataset } from '../AA1_U2/src/generarDataset.js';

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

// Maximo teorico de comparaciones de la busqueda binaria: floor(log2(n)) + 1.
const maximoTeorico = (n) => Math.floor(Math.log2(n)) + 1;

// Escribe un dataset en formato JSONL (un registro por linea) y devuelve la ruta.
const carpeta = mkdtempSync(join(tmpdir(), 'busqueda-binaria-'));
function crearArchivo(registros, nombre) {
    const ruta = join(carpeta, nombre);
    writeFileSync(ruta, registros.map((r) => JSON.stringify(r)).join('\n') + '\n', 'utf8');
    return ruta;
}

// ---------------------------- ARREGLO ----------------------------
probar('arreglo: encuentra TODOS los ids (1 000 registros)', () => {
    const datos = generarDataset(1000);
    for (const r of datos) {
        const res = buscarBinarioArreglo(datos, r.id);
        assert.strictEqual(res.registro, r);
        assert.ok(res.comparaciones >= 1 && res.comparaciones <= maximoTeorico(1000));
    }
});

probar('arreglo: id inexistente devuelve { registro: null, comparaciones }', () => {
    const datos = generarDataset(1000);
    for (const id of [0, -5, 1001, 999999]) {
        const res = buscarBinarioArreglo(datos, id);
        assert.strictEqual(res.registro, null);
        assert.ok(res.comparaciones <= maximoTeorico(1000));
    }
});

probar('arreglo: casos limite (vacio, un elemento, dos elementos)', () => {
    assert.deepStrictEqual(buscarBinarioArreglo([], 1), { registro: null, comparaciones: 0 });
    const uno = [{ id: 7 }];
    assert.deepStrictEqual(buscarBinarioArreglo(uno, 7), { registro: uno[0], comparaciones: 1 });
    assert.deepStrictEqual(buscarBinarioArreglo(uno, 8), { registro: null, comparaciones: 1 });
    const dos = [{ id: 2 }, { id: 4 }];
    assert.strictEqual(buscarBinarioArreglo(dos, 2).registro, dos[0]);
    assert.strictEqual(buscarBinarioArreglo(dos, 4).registro, dos[1]);
    assert.strictEqual(buscarBinarioArreglo(dos, 3).registro, null);
});

probar('arreglo: ids NO consecutivos (huecos) y primer/ultimo elemento', () => {
    const datos = [3, 8, 15, 22, 40, 41, 90].map((id) => ({ id }));
    for (const r of datos) assert.strictEqual(buscarBinarioArreglo(datos, r.id).registro, r);
    for (const id of [1, 9, 16, 42, 100]) assert.strictEqual(buscarBinarioArreglo(datos, id).registro, null);
});

probar('arreglo: mismo resultado que la secuencial en 50 000 registros', () => {
    const datos = generarDataset(50000);
    for (const id of [1, 2, 777, 25000, 49999, 50000, 0, 50001]) {
        const b = buscarBinarioArreglo(datos, id);
        const s = buscarSecuencialArreglo(datos, id);
        assert.strictEqual(b.registro, s.registro);
        assert.ok(b.comparaciones <= maximoTeorico(50000));
    }
});

probar('arreglo: peor caso = floor(log2 n)+1 comparaciones (1 000, 50 000 y 500 000)', () => {
    for (const n of [1000, 50000, 500000]) {
        const datos = generarDataset(n);
        let maximo = 0;
        for (const id of [0, 1, n, n + 1, Math.floor(n / 3), Math.floor(n / 2)]) {
            maximo = Math.max(maximo, buscarBinarioArreglo(datos, id).comparaciones);
        }
        assert.ok(maximo <= maximoTeorico(n));
        console.log(`   n = ${n}: maximo observado ${maximo} comparaciones (teorico ${maximoTeorico(n)})`);
    }
});

probar('arreglo: no modifica el arreglo recibido', () => {
    const datos = generarDataset(200);
    const copia = JSON.stringify(datos);
    buscarBinarioArreglo(datos, 100);
    buscarBinarioArreglo(datos, -1);
    assert.strictEqual(JSON.stringify(datos), copia);
});

// ---------------------------- ARCHIVO ----------------------------
probar('archivo: encuentra TODOS los ids y coincide con el arreglo (1 000 registros)', () => {
    const datos = generarDataset(1000);
    const archivo = abrirArchivo(crearArchivo(datos, 'datos_1000.jsonl'));
    try {
        assert.strictEqual(archivo.total, 1000);
        for (const r of datos) {
            const enArchivo = buscarBinarioArchivo(archivo, r.id);
            const enArreglo = buscarBinarioArreglo(datos, r.id);
            assert.deepStrictEqual(enArchivo.registro, r);
            assert.strictEqual(enArchivo.comparaciones, enArreglo.comparaciones);
        }
    } finally {
        archivo.cerrar();
    }
});

probar('archivo: id inexistente devuelve { registro: null, comparaciones }', () => {
    const datos = generarDataset(1000);
    const archivo = abrirArchivo(crearArchivo(datos, 'datos_1000b.jsonl'));
    try {
        for (const id of [0, -1, 1001, 123456]) {
            const res = buscarBinarioArchivo(archivo, id);
            assert.strictEqual(res.registro, null);
            assert.ok(res.comparaciones >= 1 && res.comparaciones <= maximoTeorico(1000));
        }
    } finally {
        archivo.cerrar();
    }
});

probar('archivo: registros con tildes y enie (UTF-8 multibyte) se leen bien', () => {
    const datos = generarDataset(300).filter((r) => /[ñóáíé]/i.test(r.producto + r.categoria + r.tienda));
    assert.ok(datos.length > 0);
    const archivo = abrirArchivo(crearArchivo(datos, 'datos_tildes.jsonl'));
    try {
        for (const r of datos) assert.deepStrictEqual(buscarBinarioArchivo(archivo, r.id).registro, r);
    } finally {
        archivo.cerrar();
    }
});

probar('archivo: casos limite (un registro y archivo vacio)', () => {
    const uno = abrirArchivo(crearArchivo([{ id: 5, producto: 'X' }], 'uno.jsonl'));
    const vacio = abrirArchivo(crearArchivo([], 'vacio.jsonl'));
    try {
        assert.deepStrictEqual(buscarBinarioArchivo(uno, 5).registro, { id: 5, producto: 'X' });
        assert.deepStrictEqual(buscarBinarioArchivo(uno, 6), { registro: null, comparaciones: 1 });
        assert.deepStrictEqual(buscarBinarioArchivo(vacio, 1), { registro: null, comparaciones: 0 });
    } finally {
        uno.cerrar();
        vacio.cerrar();
    }
});

probar('archivo: 50 000 y 500 000 registros (muestra de ids + peor caso)', () => {
    for (const n of [50000, 500000]) {
        const datos = generarDataset(n);
        const archivo = abrirArchivo(crearArchivo(datos, `datos_${n}.jsonl`));
        try {
            assert.strictEqual(archivo.total, n);
            const muestra = [1, 2, 3, Math.floor(n / 4), Math.floor(n / 2), n - 1, n];
            for (const id of muestra) {
                const res = buscarBinarioArchivo(archivo, id);
                assert.deepStrictEqual(res.registro, datos[id - 1]);
                assert.ok(res.comparaciones <= maximoTeorico(n));
            }
            const peor = buscarBinarioArchivo(archivo, n + 1);
            assert.strictEqual(peor.registro, null);
            assert.ok(peor.comparaciones <= maximoTeorico(n));
            console.log(`   n = ${n}: id inexistente -> ${peor.comparaciones} comparaciones (teorico ${maximoTeorico(n)})`);
        } finally {
            archivo.cerrar();
        }
    }
});

probar('archivo: pasar una ruta en vez de abrirArchivo() lanza un error claro', () => {
    assert.throws(() => buscarBinarioArchivo('datos.jsonl', 1), TypeError);
    assert.throws(() => buscarBinarioArchivo(null, 1), TypeError);
});

rmSync(carpeta, { recursive: true, force: true });
console.log(`\nResultado: ${correctas} correctas, ${fallidas} fallidas`);
if (fallidas > 0) process.exitCode = 1;
