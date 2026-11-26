
# Matriz de casos de prueba

## Resumen de resultados

| Módulo | Pruebas | Aprobadas | Fallidas |
|---|---:|---:|---:|
| Ordenamiento | 10 | 10 | 0 |
| Búsqueda | 22 | 22 | 0 |
| Heaps | 4 | 4 | 0 |
| **Total** | **36** | **36** | **0** |

**Fecha:** 26/11/2026  
**Archivo:** `pruebas-validacion/matrizCasosPrueba.test.js`

## 1. Ordenamiento

Pruebas realizadas con MergeSort y QuickSort.

| ID | Caso | Tipo | Entrada | Salida esperada | Estado |
|---|---|---|---|---|---|
| O01 | Arreglo vacío | Borde | `[]` | `[]` en ambos algoritmos | Aprobado |
| O02 | Un elemento | Borde | `[5]` | `[5]` en ambos algoritmos | Aprobado |
| O03 | MergeSort | Normal | `[8,3,10,1,6]` | `[1,3,6,8,10]` | Aprobado |
| O04 | QuickSort | Normal | `[8,3,10,1,6]` | `[1,3,6,8,10]` | Aprobado |
| O05 | Negativos y repetidos | Borde | `[0,-3,5,-3,0]` | `[-3,-3,0,0,5]` | Aprobado |
| O06 | Orden inverso | Borde | `[9,7,5,3,1]` | `[1,3,5,7,9]` | Aprobado |
| O07 | Orden multicriterio | Normal | 5 productos agrícolas | IDs `[1,5,2,3,4]` | Aprobado |
| O08 | Criterios personalizados | Normal | Precio e ID ascendente | IDs `[3,4,1,2,5]` | Aprobado |
| O09 | Conservar arreglo original | Integridad | `[5,2,8,1]` | Arreglo original sin cambios | Aprobado |
| O10 | Estabilidad de MergeSort | Integridad | IDs `[1,2,3]`, precios `[5,3,5]` | IDs `[2,1,3]` | Aprobado |

## 2. Búsqueda

### 2.1. Búsqueda secuencial en arreglos

| ID | Caso | Tipo | Entrada | Salida esperada | Estado |
|---|---|---|---|---|---|
| B01 | Primer registro | Normal | IDs `[1,2,3]`, buscar 1 | ID 1, 1 comparación | Aprobado |
| B02 | Registro intermedio | Normal | IDs `[1,2,3]`, buscar 2 | ID 2, 2 comparaciones | Aprobado |
| B03 | Último registro | Borde | IDs `[1,2,3]`, buscar 3 | ID 3, 3 comparaciones | Aprobado |
| B04 | ID inexistente | Borde | IDs `[1,2,3]`, buscar 99 | `null`, 3 comparaciones | Aprobado |
| B05 | Arreglo vacío | Borde | `[]`, buscar 1 | `null`, 0 comparaciones | Aprobado |

### 2.2. Búsqueda binaria en arreglos

| ID | Caso | Tipo | Entrada | Salida esperada | Estado |
|---|---|---|---|---|---|
| B06 | Primer registro | Normal | IDs `[1,2,3]`, buscar 1 | ID 1, 2 comparaciones | Aprobado |
| B07 | Registro central | Normal | IDs `[1,2,3]`, buscar 2 | ID 2, 1 comparación | Aprobado |
| B08 | Último registro | Borde | IDs `[1,2,3]`, buscar 3 | ID 3, 2 comparaciones | Aprobado |
| B09 | ID inexistente | Borde | IDs `[1,2,3]`, buscar 99 | `null`, 2 comparaciones | Aprobado |
| B10 | Arreglo vacío | Borde | `[]`, buscar 1 | `null`, 0 comparaciones | Aprobado |

### 2.3. Búsqueda secuencial en archivos JSONL

| ID | Caso | Tipo | Entrada | Salida esperada | Estado |
|---|---|---|---|---|---|
| B11 | Primer registro | Normal | IDs `[1,2,3]`, buscar 1 | ID 1, 1 comparación | Aprobado |
| B12 | Último registro | Borde | IDs `[1,2,3]`, buscar 3 | ID 3, 3 comparaciones | Aprobado |
| B13 | ID inexistente | Borde | IDs `[1,2,3]`, buscar 99 | `null`, 3 comparaciones | Aprobado |
| B14 | Archivo vacío | Borde | Archivo vacío, buscar 1 | `null`, 0 comparaciones | Aprobado |

### 2.4. Búsqueda binaria en archivos indexados

| ID | Caso | Tipo | Entrada | Salida esperada | Estado |
|---|---|---|---|---|---|
| B15 | Primer registro | Normal | IDs `[1,2,3]`, buscar 1 | ID 1, 2 comparaciones | Aprobado |
| B16 | Registro central | Normal | IDs `[1,2,3]`, buscar 2 | ID 2, 1 comparación | Aprobado |
| B17 | Último registro | Borde | IDs `[1,2,3]`, buscar 3 | ID 3, 2 comparaciones | Aprobado |
| B18 | ID inexistente | Borde | IDs `[1,2,3]`, buscar 99 | `null`, 2 comparaciones | Aprobado |
| B19 | Archivo vacío | Borde | Archivo vacío, buscar 1 | `null`, 0 comparaciones | Aprobado |
| B20 | Un registro | Borde | ID `[7]`, buscar 7 | ID 7, 1 comparación | Aprobado |
| B21 | Caracteres UTF-8 | Integridad | Piña, Café, Ñame; buscar ID 3 | Ñame, 2 comparaciones | Aprobado |
| B22 | ID inexistente en 1000 registros | Volumen | IDs 1–1000, buscar 1001 | `null`, 10 comparaciones | Aprobado |

## 3. Heaps

Pruebas realizadas con Min-Heap y Max-Heap.

| ID | Caso | Tipo | Entrada | Salida esperada | Estado |
|---|---|---|---|---|---|
| H01 | Min-Heap vacío | Borde | Heap sin elementos | Raíz `null`, cantidad 0 y vacío | Aprobado |
| H02 | Inserción Min-Heap | Normal | `[8,3,10,1,6]` | Raíz 1 y Heap válido | Aprobado |
| H03 | Inserción Max-Heap | Normal | `[8,3,10,1,6]` | Raíz 10 y Heap válido | Aprobado |
| H04 | Negativos y repetidos | Borde | `[0,-3,5,-3,0]` | Extracción `[-3,-3,0,0,5]` | Aprobado |

**Validación adicional:** también se ejecutaron las 16 pruebas unitarias del módulo Heaps, todas aprobadas.

## 4. Ejecución

Comando utilizado:

```bash
node --test AA3_U2/pruebas-validacion/matrizCasosPrueba.test.js
```
