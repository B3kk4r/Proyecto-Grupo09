/**
 * Benchmark de busqueda secuencial y binaria, en arreglo y archivo.
 * Proyecto-Grupo09 / AA Cuadro Comparativo - Noelia.
 * Ejecutar desde la raiz: node benchmarkBusqueda.js --rapido (prueba corta)
 *                         node benchmarkBusqueda.js          (1000 consultas por tamano)
 * Los datos de prueba se crean en una carpeta temporal y se eliminan al final.
 */
import { performance } from 'node:perf_hooks';
import { mkdtempSync, writeFileSync, appendFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { generarDataset } from '../AA1_U2/src/generarDataset.js';
import { buscarSecuencialArreglo, buscarSecuencialArchivo } from './busquedaSecuencial.js';
import { buscarBinarioArreglo, buscarBinarioArchivo } from './busquedaBinaria.js';
import { abrirArchivo } from './archivoIndexado.js';

const carpetaProyecto = dirname(fileURLToPath(import.meta.url));
const rutaResultados = join(carpetaProyecto, 'resultados-busqueda.json');
const carpetaTemporal = mkdtempSync(join(tmpdir(), 'comparativo-busquedas-'));
const tamanos = [1000, 50000, 500000];
const rapido = process.argv.includes('--rapido');
const consultasSolicitadas = rapido ? 20 : 1000;
const semilla = 2026;
const resultados = [];

function guardarJSONL(registros, ruta) {
  writeFileSync(ruta, '', 'utf8');
  const bloque = 5000;
  for (let i = 0; i < registros.length; i += bloque) {
    appendFileSync(ruta, registros.slice(i, i + bloque).map(r => JSON.stringify(r)).join('\n') + '\n', 'utf8');
  }
}

// Todos los IDs existen, son distintos y recorren diferentes zonas del conjunto.
function crearIds(n, cantidad) {
  return Array.from({ length: cantidad }, (_, i) => 1 + ((i * 997 + Math.floor(n / 3)) % n));
}

async function medir(metodo, medio, escenario, tamano, ids, buscar) {
  let tiempoTotalMs = 0;
  let totalComparaciones = 0;
  let comparacionesMaximas = 0;
  for (let i = 0; i < ids.length; i++) {
    const inicio = performance.now();
    const respuesta = await buscar(ids[i]);
    const transcurrido = performance.now() - inicio;
    // Verificar las salidas de las funciones originales, sin modificarlas.
    if (escenario === 'Encontrado' && respuesta.registro?.id !== ids[i]) {
      throw new Error(`${metodo} ${medio}: fallo con ID ${ids[i]}`);
    }
    if (escenario === 'No encontrado' && respuesta.registro !== null) {
      throw new Error(`${metodo} ${medio}: debio devolver null para ID ${ids[i]}`);
    }
    tiempoTotalMs += transcurrido;
    totalComparaciones += respuesta.comparaciones;
    comparacionesMaximas = Math.max(comparacionesMaximas, respuesta.comparaciones);
  }
  const entrada = {
    tamano, metodo, medio, escenario, consultas: ids.length,
    tiempoTotalMs: Number(tiempoTotalMs.toFixed(6)),
    tiempoPromedioMs: Number((tiempoTotalMs / ids.length).toFixed(6)),
    comparacionesPromedio: Number((totalComparaciones / ids.length).toFixed(3)),
    comparacionesMaximas
  };
  resultados.push(entrada);
  console.log(`${String(tamano).padStart(6)} | ${metodo.padEnd(10)} | ${medio.padEnd(7)} | ${escenario.padEnd(13)} | ${ids.length} pruebas | ${entrada.tiempoPromedioMs.toFixed(4)} ms | ${entrada.comparacionesPromedio} comp.`);
}

try {
  console.log(`\nBenchmark de busquedas (${rapido ? 'PRUEBA RAPIDA' : '1000 BUSQUEDAS POR TAMANO'})`);
  console.log('Se miden solamente las busquedas; generar los datos e indexar el archivo NO se incluye en el tiempo.');
  console.log('tamano | metodo     | medio   | escenario     | consultas | promedio ms | promedio comp.');

  for (const n of tamanos) {
    const datos = generarDataset(n, semilla);
    const ruta = join(carpetaTemporal, `datos_${n}.jsonl`);
    guardarJSONL(datos, ruta);
    const archivo = abrirArchivo(ruta);
    if (archivo.total !== n) throw new Error(`El indice contiene ${archivo.total} registros, esperado ${n}`);
    const ids = crearIds(n, consultasSolicitadas);
    const idInexistente = n + 1; // peor caso: ausente, por encima del mayor ID
    try {
      // Las cuatro funciones ejecutan las mismas consultas para una comparacion justa.
      const opciones = [
        ['Secuencial', 'Arreglo', id => buscarSecuencialArreglo(datos, id)],
        ['Binaria', 'Arreglo', id => buscarBinarioArreglo(datos, id)],
        ['Secuencial', 'Archivo', id => buscarSecuencialArchivo(ruta, id)],
        ['Binaria', 'Archivo', id => buscarBinarioArchivo(archivo, id)]
      ];
      for (const [metodo, medio, buscar] of opciones) {
        console.log(`\nIniciando: ${metodo} / ${medio} / ${n} registros`);
        const idsDePrueba = metodo === 'Secuencial' && medio === 'Archivo'
  ? ids.slice(0, 30) : ids;

await medir(metodo, medio, 'Encontrado', n, idsDePrueba, buscar);
        await medir(metodo, medio, 'No encontrado', n, [idInexistente], buscar);
      }
    } finally {
      archivo.cerrar();
    }
  }
  const informe = {
    titulo: 'Cuadro comparativo: busqueda secuencial vs. binaria',
    generadoEn: new Date().toISOString(),
    modo: rapido ? 'prueba rapida' : 'completo',
    consultasPorTamano: consultasSolicitadas,
    semilla,
    tamanos,
    notas: [
      'Los cuatro metodos utilizan los mismos IDs existentes por tamano.',
      'El escenario No encontrado emplea un ID fuera del conjunto y una busqueda por metodo y tamano.',
      'El tiempo no incluye generar datos, escribir el JSONL ni construir el indice.',
      'Las comparaciones corresponden a la cantidad de registros examinados.'
    ],
    resultados
  };
  writeFileSync(rutaResultados, JSON.stringify(informe, null, 2) + '\n', 'utf8');
  console.log(`\nLISTO. Resultados guardados en: ${rutaResultados}`);
  if (rapido) console.log('ATENCION: este archivo contiene solo 20 consultas por tamano. Ejecuta node benchmarkBusqueda.js para el benchmark final.');
} catch (error) {
  console.error('\nERROR en benchmark:', error);
  process.exitCode = 1;
} finally {
  rmSync(carpetaTemporal, { recursive: true, force: true });
}
