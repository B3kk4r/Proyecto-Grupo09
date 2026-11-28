import { claveProducto, comparar, insertarNodo } from './nodo.js';
import { buscarNodo } from './busqueda.js';
import { eliminarNodo } from './eliminacion.js';
import { recorridoInorden, validar } from './recorrido.js';

// Árbol AVL (binario de búsqueda auto-balanceado).
// Cada nodo guarda todos los registros que comparten la misma clave.
//
// La clave se configura al crear el árbol
//   new GreenBST()                        -> clave: registro.producto
//   new GreenBST({ clave: 'id' })         -> clave: registro.id
//   new GreenBST({ clave: (r) => r.precio })
export class GreenBST {
    #raiz = null;
    #claveDe;

    constructor({ clave = 'producto' } = {}) {
        if (typeof clave === 'function') {
            this.#claveDe = clave;
        } else if (typeof clave === 'string' && clave.length > 0) {
            this.#claveDe = (r) => r[clave];
        } else {
            throw new TypeError('La clave debe ser el nombre de un campo o una funcion');
        }
    }

    // Inserta un registro en O(log n). Si la clave ya existe, el registro se agrega a ese nodo.
    insertar(registro) {
        if (registro === null || typeof registro !== 'object') {
            throw new TypeError('El registro debe ser un objeto');
        }
        const clave = this.#claveDe(registro);
        if (clave === undefined || clave === null) {
            throw new Error('El registro no tiene valor en el campo usado como clave');
        }
        this.#raiz = insertarNodo(this.#raiz, registro, this.#claveDe);
    }

    // Devuelve los registros de esa clave, o un arreglo vacío si no existe.
    buscar(clave) {
        const nodo = buscarNodo(this.#raiz, clave);
        return nodo ? nodo.registros : [];
    }

    // Igual que buscar, pero cuenta las comparaciones realizadas.
    // Devuelve { registros: Registro[] | null, comparaciones: number }
    buscarConComparaciones(clave) {
        let nodo = this.#raiz;
        let comparaciones = 0;

        while (nodo !== null) {
            comparaciones++;
            const c = comparar(clave, nodo.clave);
            if (c === 0) return { registros: nodo.registros, comparaciones };
            nodo = c < 0 ? nodo.izq : nodo.der;
        }

        return { registros: null, comparaciones };
    }

    // Elimina la clave con todos sus registros. Devuelve true si existía.
    eliminar(clave) {
        const existe = buscarNodo(this.#raiz, clave) !== null;
        if (existe) this.#raiz = eliminarNodo(this.#raiz, clave);
        return existe;
    }

    // Todos los registros ordenados por clave.
    enOrden() {
        return recorridoInorden(this.#raiz);
    }

    // Comprueba orden, alturas y balance AVL de todo el árbol.
    validar() {
        return validar(this.#raiz, this.#claveDe);
    }

    // Altura del árbol, es 0 si está vacío. En un AVL es menor que 1.44 * log2(n + 2).
    altura() {
        return this.#raiz ? this.#raiz.altura : 0;
    }

    estaVacio() {
        return this.#raiz === null;
    }

    // Raíz del árbol, útil para hacer pruebas de rotaciones.
    obtenerRaiz() {
        return this.#raiz;
    }
}