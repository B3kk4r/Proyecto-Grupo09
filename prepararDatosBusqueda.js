///Lucas Sebastian Orellana Martinez
import { mkdirSync, writeFileSync, appendFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { generarDataset } from './AA1_U2/src/generarDataset.js';

// Configuracion de los datos de prueba.
const CANTIDADES = [1000, 50000, 500000];
const SEMILLA = 2026;
const TAMANIO_BLOQUE = 1000;

// Obtengo la ruta donde se guardaran los archivos.
const carpetaActual = dirname(fileURLToPath(import.meta.url));
const carpetaUnidad = join(carpetaActual, '..');
const carpetaDatos = join(carpetaUnidad, 'datos-busqueda');

// Verifica que los registros esten ordenados por ID.
export function esteOrdenadoPorId(registros) {
  if (!Array.isArray(registros)) {
    return false;
  }

  for (let posicion = 0; posicion < registros.length; posicion++) {
    const registroActual = registros[posicion];

    if (registroActual === null || typeof registroActual !== 'object') {
      return false;
    }

    if (!Number.isSafeInteger(registroActual.id) || registroActual.id <= 0) {
      return false;
    }

    if (posicion > 0) {
      const idAnterior = registros[posicion - 1].id;
      const idActual = registroActual.id;

      if (idAnterior >= idActual) {
        return false;
      }
    }
  }

  return true;
}

// Valida la cantidad y los campos de cada registro.
function validarRegistros(registros, cantidadEsperada) {
  if (registros.length !== cantidadEsperada) {
    throw new Error(
      `Se esperaban ${cantidadEsperada} registros, pero se obtuvieron ${registros.length}`
    );
  }

  if (!esteOrdenadoPorId(registros)) {
    throw new Error('Los registros no estan ordenados correctamente por ID');
  }

  for (let posicion = 0; posicion < registros.length; posicion++) {
    const registro = registros[posicion];

    if (registro.id !== posicion + 1) {
      throw new Error(`ID incorrecto en el registro ${posicion + 1}`);
    }

    if (
      typeof registro.producto !== 'string' ||
      registro.producto.trim() === '' ||
      typeof registro.categoria !== 'string' ||
      registro.categoria.trim() === '' ||
      typeof registro.tienda !== 'string' ||
      registro.tienda.trim() === ''
    ) {
      throw new Error(`Faltan datos de texto en el registro ${registro.id}`);
    }

    if (
      !Number.isFinite(registro.precio) ||
      registro.precio <= 0 ||
      !Number.isSafeInteger(registro.cantidad) ||
      registro.cantidad <= 0
    ) {
      throw new Error(`Precio o cantidad incorrecta en el registro ${registro.id}`);
    }
  }
}

// Guarda los registros en formato JSONL, uno por linea.
function guardarRegistros(registros, rutaArchivo) {
  writeFileSync(rutaArchivo, '', 'utf8');

  for (let inicio = 0; inicio < registros.length; inicio += TAMANIO_BLOQUE) {
    const fin = Math.min(inicio + TAMANIO_BLOQUE, registros.length);
    let bloque = '';

    for (let posicion = inicio; posicion < fin; posicion++) {
      bloque += JSON.stringify(registros[posicion]) + '\n';
    }

    appendFileSync(rutaArchivo, bloque, 'utf8');
  }
}

// Genera, valida y guarda los conjuntos de datos.
export function prepararArchivosBusqueda() {
  mkdirSync(carpetaDatos, { recursive: true });

  for (const cantidad of CANTIDADES) {
    const registros = generarDataset(cantidad, SEMILLA);

    validarRegistros(registros, cantidad);

    const nombreArchivo = `datos_${cantidad}.jsonl`;
    const rutaArchivo = join(carpetaDatos, nombreArchivo);

    guardarRegistros(registros, rutaArchivo);

    console.log('----------------------------------------');
    console.log(`Archivo generado: ${nombreArchivo}`);
    console.log(`Cantidad de registros: ${registros.length}`);
    console.log('Ordenados por ID: SI');
    console.log(`Primer ID: ${registros[0].id}`);
    console.log(`Ultimo ID: ${registros[registros.length - 1].id}`);
  }

  console.log('----------------------------------------');
  console.log('Se generaron correctamente los tres archivos.');
}

// Control de errores durante la ejecucion.
try {
  prepararArchivosBusqueda();
} catch (error) {
  console.error('Error al preparar los datos:', error.message);
  process.exitCode = 1;
}
