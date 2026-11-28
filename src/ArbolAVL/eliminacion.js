import { comparar, rebalancear } from './nodo.js';
import { minimo } from './busqueda.js';

// Elimina un nodo del árbol según su clave.
export function eliminarNodo(n, clave) {

    // Si el árbol está vacío, no hay nada que eliminar.
    if (n === null) {
        return null;
    }

    // Compara la clave buscada con la clave del nodo actual.
    const c = comparar(clave, n.clave);

    // Si la clave es menor, busca en el subárbol izquierdo.
    if (c < 0) {
        n.izq = eliminarNodo(n.izq, clave);
    }

    // Si la clave es mayor, busca en el subárbol derecho.
    else if (c > 0) {
        n.der = eliminarNodo(n.der, clave);
    }

    // Si las claves coinciden, encontramos el nodo que queremos eliminar.
    else {

        // Si existen varios registros con la misma clave,
        // se elimina únicamente el nodo completo según esta operación.
        // En este árbol, todos los registros comparten la misma clave.
        // Por tanto, se elimina el nodo y sus registros asociados.

        // El nodo no tiene hijos.
        if (n.izq === null && n.der === null) {
            return null;
        }

        // El nodo solamente tiene hijo derecho.
        if (n.izq === null) {
            return n.der;
        }

        // El nodo solamente tiene hijo izquierdo.
        if (n.der === null) {
            return n.izq;
        }

        // El nodo tiene dos hijos.
        // Se busca el nodo con la clave mínima del subárbol derecho.
        const sucesor = minimo(n.der);

        // Se reemplazan la clave y los registros del nodo actual
        // por los del sucesor.
        n.clave = sucesor.clave;
        n.registros = sucesor.registros;

        // Se elimina el sucesor de su posición original.
        n.der = eliminarNodo(n.der, sucesor.clave);
    }

    // Actualiza la altura del nodo, lo rebalancea si hace falta
    // y devuelve la raíz del subárbol actualizado.
    return rebalancear(n);
}