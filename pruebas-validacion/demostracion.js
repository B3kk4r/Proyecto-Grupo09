// Permite la comparación entre el antes y el después del ordenamiento
import { generarDataset } from '../src/generarDataset.js';
import { mergeSort, quickSort } from '../src/ordenación.js';
import { crearComparador, estaOrdenado } from '../src/comparadores.js';

const N = 100000;
const cmp = crearComparador();
const datos = generarDataset(N);
console.log(`Dataset: ${N} registros`);
console.log('Criterios: categoria ASC -> precio DESC -> producto ASC (desempate: id ASC)');

console.log('\nMuestra en consola una vista previa de los primeros 10 registros sin ordenar')
console.log('\n=== ANTES del ordenamiento ===');
console.table(datos.slice(0, 10));
// Define e itera sobre los algoritmos a evaluar para medir su tiempo de ejecución
for (const [nombre, fn] of [['MergeSort', mergeSort], ['QuickSort', quickSort]]) {
    const t0 = performance.now();
    const ordenado = fn(datos, cmp);
    const ms = performance.now() - t0;

    console.log(`\n=== DESPUES - ${nombre} ===`);
    console.table(ordenado.slice(0, 10));
    console.log(`${nombre}: ${ms.toFixed(2)} ms | ordenado: ${estaOrdenado(ordenado, cmp)} | registros: ${ordenado.length}`);
}