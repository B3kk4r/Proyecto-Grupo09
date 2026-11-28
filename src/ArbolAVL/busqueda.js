
import { comparar } from './nodo.js';

// Busca un nodo dentro del árbol mediante su clave.
export function buscarNodo(n, clave) {
    if (n === null) {
        return null;
    }

    const c = comparar(clave, n.clave);

    if (c === 0) {
        return n;
    }

    if (c < 0) {
        return buscarNodo(n.izq, clave);
    }

    return buscarNodo(n.der, clave);
}

// Encuentra el nodo con la clave más pequeña.
export function minimo(n) {
    if (n === null) {
        return null;
    }

    while (n.izq !== null) {
        n = n.izq;
    }

    return n;
}
