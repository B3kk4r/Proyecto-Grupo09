# Búsqueda binaria por id (arreglo y archivo) – @dannybeltran-sketch

Archivo nuevo: `busquedaBinaria.js` · Pruebas: `pruebas-validacion/pruebasBusquedaBinaria.js`

## API
```js
import { buscarBinarioArreglo, buscarBinarioArchivo } from './busquedaBinaria.js';
import { abrirArchivo } from './archivoIndexado.js';

buscarBinarioArreglo(registros, idBuscado);   // registros ordenados por id
// -> { registro: {...} | null, comparaciones: n }

const archivo = abrirArchivo('datos-busqueda/datos_1000.jsonl'); // índice en bytes (se construye UNA vez)
buscarBinarioArchivo(archivo, idBuscado);     // lee un solo registro por paso, con leerPorIndice(i)
// -> { registro: {...} | null, comparaciones: n }
archivo.cerrar();
```

## Reglas
- Los datos deben estar **ordenados ascendentemente por id** (`estaOrdenadoPorId`).
- **Conteo de comparaciones:** cada registro examinado cuenta 1 (mismo criterio que `busquedaSecuencial.js`),
  por lo que secuencial y binaria se comparan con la misma unidad.
- Peor caso (id inexistente): `floor(log2 n) + 1` → **10** (n = 1 000), **16** (n = 50 000), **19** (n = 500 000).
- Arreglo y archivo comparten el mismo núcleo, así que devuelven las mismas comparaciones para el mismo id.
- `buscarBinarioArchivo` recibe el objeto de `abrirArchivo(ruta)` (no la ruta): así el benchmark abre el archivo y
  construye el índice una sola vez y no lo cuenta dentro del tiempo de cada búsqueda.

## Ejecutar las pruebas (13 pruebas)
```bash
node pruebas-validacion/pruebasBusquedaBinaria.js
```
Requiere `archivoIndexado.js`, `busquedaSecuencial.js` y `AA1_U2/src/generarDataset.js` del repositorio.
