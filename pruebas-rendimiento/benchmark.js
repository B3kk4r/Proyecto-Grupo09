// PRUEBA DE RENDIMIENTO:
// Tiempo (ms) y memoria heapUsed de MergeSort y QuickSort.
//
// Cada medición se repite REPS veces y se reporta la mediana.
//
// Uso:
// node --expose-gc pruebas-rendimiento/benchmark.js
// npm run benchmark

import {
    writeFileSync,
    mkdirSync
} from 'node:fs';

import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { generarDataset } from '../src/generarDataset.js';

import {
    mergeSort,
    quickSort
} from '../src/ordenación.js';

import {
    crearComparador,
    CRITERIOS_POR_DEFECTO,
    estaOrdenado
} from '../src/comparadores.js';

// Configuración del benchmark.
const TAMANIOS = [1000, 10000, 100000, 500000];
const REPS = 5;

const cmp = crearComparador(CRITERIOS_POR_DEFECTO);

// Calcula la mediana de un conjunto de valores.
// Se ordena con mergeSort propio: el proyecto no usa el metodo nativo .sort().
function mediana(valores) {
    const ordenados = mergeSort(valores);

    return ordenados[Math.floor(ordenados.length / 2)];
}

// Mide tiempo de ejecución y diferencia de memoria.
function medir(fn, datos) {
    if (global.gc) {
        global.gc();
    }

    const antes = process.memoryUsage().heapUsed;

    const t0 = process.hrtime.bigint();

    const resultado = fn(datos, cmp);

    const t1 = process.hrtime.bigint();

    const despues = process.memoryUsage().heapUsed;

    return {
        resultado,
        ms: Number(t1 - t0) / 1e6,
        deltaMB: (despues - antes) / 1048576,
        finalMB: despues / 1048576
    };
}

// Advertencia si no se habilitó el recolector manual.
if (!global.gc) {
    console.warn(
        'AVISO: ejecute con --expose-gc para obtener mediciones de memoria más estables.\n'
    );
}

// Almacena los resultados.
const filas = [];

console.log(
    'Algoritmo   | N       | Tiempo (ms) | Delta heapUsed (MB) | heapUsed final (MB) | OK'
);

console.log(
    '------------|---------|-------------|---------------------|---------------------|----'
);

// Ejecutar pruebas para cada tamaño.
for (const n of TAMANIOS) {
    const datos = generarDataset(n);

    for (const [nombre, fn] of [
        ['MergeSort', mergeSort],
        ['QuickSort', quickSort]
    ]) {

        // Calentamiento del motor JIT.
        fn(datos.slice(0, Math.min(n, 2000)), cmp);

        const tiempos = [];
        const deltas = [];
        const finales = [];

        let ok = true;

        // Repetir las mediciones.
        for (let r = 0; r < REPS; r++) {
            const m = medir(fn, datos);

            tiempos.push(m.ms);
            deltas.push(m.deltaMB);
            finales.push(m.finalMB);

            ok = ok &&
                m.resultado.length === n &&
                estaOrdenado(m.resultado, cmp);
        }

        // Construir resultado de la medición.
        const fila = {
            algoritmo: nombre,
            n,
            ms: mediana(tiempos),
            deltaMB: mediana(deltas),
            finalMB: mediana(finales),
            ok
        };

        filas.push(fila);

        // Mostrar resultado.
        console.log(
            `${nombre.padEnd(11)} | ` +
            `${String(n).padEnd(7)} | ` +
            `${fila.ms.toFixed(2).padStart(11)} | ` +
            `${fila.deltaMB.toFixed(2).padStart(19)} | ` +
            `${fila.finalMB.toFixed(2).padStart(19)} | ` +
            `${ok ? 'SI' : 'NO'}`
        );
    }
}

// Crear carpeta de resultados automáticamente.
const directorio = dirname(fileURLToPath(import.meta.url));

const carpetaResultados = join(
    directorio,
    'resultados'
);

mkdirSync(carpetaResultados, { recursive: true });

// Ruta del archivo JSON.
const salida = join(
    carpetaResultados,
    'benchmark.json'
);

// Guardar resultados.
writeFileSync(
    salida,
    JSON.stringify({
        node: process.version,
        plataforma: process.platform,
        repeticiones: REPS,
        tamanios: TAMANIOS,
        criterios: CRITERIOS_POR_DEFECTO,
        filas
    }, null, 2),
    'utf8'
);

console.log('\nResultados guardados en pruebas-rendimiento/resultados/benchmark.json');
