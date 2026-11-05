
import assert from 'node:assert/strict';

// Importo las funciones de los archivos de mis companeros
// para comprobar que todas funcionen correctamente.
import { insertarNodo } from './nodo.js';
import { buscarNodo, minimo } from './busqueda.js';
import { eliminarNodo } from './eliminacion.js';
import { recorridoInorden, validar } from './recorrido.js';

// Creo la raiz del arbol vacia.
let raiz = null;

// Aqui voy contando las pruebas que salen bien.
let pruebasCorrectas = 0;

// Esta funcion ejecuta cada prueba y muestra el resultado.
function probar(descripcion, funcion) {
  try {
    funcion();
    pruebasCorrectas++;
    console.log(`PRUEBA CORRECTA: ${descripcion}`);
  } catch (error) {
    console.error(`PRUEBA FALLIDA: ${descripcion}`);
    console.error(error.message);
    process.exitCode = 1;
  }
}

// Compruebo que el arbol mantenga el orden correcto.
// Tambien reviso que los productos salgan ordenados
// cuando hago el recorrido inorden.
function comprobarArbol() {
  assert.equal(
    validar(raiz),
    true,
    'El arbol no mantiene el orden correcto'
  );

  const productos = recorridoInorden(raiz).map(
    registro => registro.producto
  );

  const ordenados = [...productos].sort();

  assert.deepEqual(productos, ordenados);
}

// Mezclo los registros para insertarlos en diferente orden.
// Uso una semilla fija para repetir las mismas pruebas.
function mezclar(lista) {
  const resultado = [...lista];
  let semilla = 2026;

  const aleatorio = () => {
    semilla = (1664525 * semilla + 1013904223) >>> 0;
    return semilla / 4294967296;
  };

  for (let i = resultado.length - 1; i > 0; i--) {
    const j = Math.floor(aleatorio() * (i + 1));

    [resultado[i], resultado[j]] = [
      resultado[j],
      resultado[i]
    ];
  }

  return resultado;
}

// Creo 100 productos con precios para realizar las pruebas.
// Estos datos son de ejemplo y no son precios reales.
const registros = Array.from({ length: 100 }, (_, i) => ({
  producto: `producto-${String(i + 1).padStart(3, '0')}`,
  feria: 'Loja',
  precio: Number((1 + i * 0.05).toFixed(2))
}));

console.log('\nPRUEBAS DEL ARBOL BST - GRUPO 9\n');

// PRUEBA 1: ARBOL VACIO

// Primero reviso que el arbol este vacio.
// Si busco un producto o el minimo, debe devolver null.
probar('Arbol vacio', () => {
  assert.equal(
    buscarNodo(raiz, 'producto-001'),
    null
  );

  assert.equal(minimo(raiz), null);

  comprobarArbol();
});

// PRUEBA 2: INSERTAR REGISTROS

// Inserto los 100 productos en orden aleatorio.
// Despues de insertar cada uno compruebo el arbol.
probar('Insertar 100 registros', () => {
  for (const registro of mezclar(registros)) {
    raiz = insertarNodo(raiz, registro);
    comprobarArbol();
  }

  // Reviso que se hayan guardado los 100 registros.
  assert.equal(recorridoInorden(raiz).length, 100);
});

// PRUEBA 3: BUSCAR PRODUCTOS EXISTENTES

// Busco varios productos que ya estan guardados.
// Compruebo que encuentre el producto correcto.
probar('Buscar productos existentes', () => {
  for (const numero of [1, 18, 50, 76, 100]) {
    const producto = `producto-${String(numero).padStart(3, '0')}`;

    const encontrado = buscarNodo(raiz, producto);

    assert.ok(encontrado);
    assert.equal(encontrado.clave, producto);
  }

  comprobarArbol();
});

// PRUEBA 4: BUSCAR UN PRODUCTO INEXISTENTE

// Intento buscar un producto que no inserte.
// En este caso debe devolver null.
probar('Buscar producto inexistente', () => {
  const encontrado = buscarNodo(raiz, 'producto-999');

  assert.equal(encontrado, null);

  comprobarArbol();
});

// PRUEBA 5: ENCONTRAR EL MINIMO

// Compruebo que encuentre el producto
// que tiene la clave mas pequena del arbol.
probar('Encontrar el minimo', () => {
  const encontrado = minimo(raiz);

  assert.equal(encontrado.clave, 'producto-001');

  comprobarArbol();
});

// PRUEBA 6: INSERTAR UN PRODUCTO REPETIDO

// Inserto un producto que ya existe,
// pero ahora con una feria y un precio diferentes.
probar('Insertar producto repetido', () => {
  raiz = insertarNodo(raiz, {
    producto: 'producto-050',
    feria: 'Feria Libre',
    precio: 4.5
  });

  const encontrado = buscarNodo(raiz, 'producto-050');

  // Compruebo que tenga los dos registros.
  assert.equal(encontrado.registros.length, 2);

  // Ahora tengo 101 registros en total.
  assert.equal(recorridoInorden(raiz).length, 101);

  comprobarArbol();
});

// PRUEBA 7: ELIMINAR PRODUCTOS

// Elimino varios productos del arbol.
// Despues de eliminar cada uno reviso
// que ya no exista y que el arbol siga ordenado.
probar('Eliminar productos', () => {
  for (const numero of [1, 50, 100, 17, 73]) {
    const producto = `producto-${String(numero).padStart(3, '0')}`;

    raiz = eliminarNodo(raiz, producto);

    assert.equal(buscarNodo(raiz, producto), null);

    comprobarArbol();
  }

  // Compruebo que queden 95 registros.
  // El producto 050 tenia dos registros.
  assert.equal(recorridoInorden(raiz).length, 95);
});

// PRUEBA 8: ELIMINAR UN PRODUCTO INEXISTENTE

// Intento eliminar un producto que no esta en el arbol.
// Compruebo que los registros sigan siendo los mismos.
probar('Eliminar producto inexistente', () => {
  const antes = recorridoInorden(raiz);

  raiz = eliminarNodo(raiz, 'producto-999');

  const despues = recorridoInorden(raiz);

  assert.deepEqual(despues, antes);

  comprobarArbol();
});

// RESULTADOS FINALES

// Muestro cuantas pruebas se realizaron correctamente.
console.log('\nRESULTADOS FINALES');
console.log(`Pruebas correctas: ${pruebasCorrectas} de 8`);

// Compruebo si alguna prueba fallo.
if (process.exitCode) {
  console.log('Existen errores que debemos revisar.');
} else {
  console.log('Todas las pruebas del BST fueron correctas.');
}

// Estas pruebas revisan el funcionamiento del BST.
// Todavia falta comprobar el balanceo del arbol AVL.
console.log('Pendiente: pruebas de balanceo AVL.');
