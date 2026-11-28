import { comparar } from './nodo.js';

 // Recorre el árbol, de izquierda, a raíz y hacia la derecha.
export function recorridoInorden(raiz) {
    let resultado = [];

    function recorrer(nodo) {
        if (nodo === null) return;

        recorrer(nodo.izq);

        // Guarda los registros del nodo actual.
        for (let i = 0; i < nodo.registros.length; i++) {
            resultado.push(nodo.registros[i]);
        }

        recorrer(nodo.der);
    }

    recorrer(raiz);
    return resultado;
}

// Recorre el árbol, de raíz, a izquierda y hacia la derecha.
export function recorridoPreorden(raiz) {
    let resultado = [];

    function recorrer(nodo) {
        if (nodo === null) return;

        // Guarda primero los registros del nodo.
        for (let i = 0; i < nodo.registros.length; i++) {
            resultado.push(nodo.registros[i]);
        }

        recorrer(nodo.izq);
        recorrer(nodo.der);
    }

    recorrer(raiz);
    return resultado;
}

// Recorre el árbol, de izquierda, a derecha y hacia la raíz.
export function recorridoPostorden(raiz) {
    let resultado = [];

    function recorrer(nodo) {
        if (nodo === null) return;

        recorrer(nodo.izq);
        recorrer(nodo.der);

        // Guarda los registros después de recorrer los hijos.
        for (let i = 0; i < nodo.registros.length; i++) {
            resultado.push(nodo.registros[i]);
        }
    }

    recorrer(raiz);
    return resultado;

}

// Comprueba que el árbol cumpla las reglas de un AVL
//   1. Orden de las claves (BST)
//   2. La altura guardada en cada nodo es correcta
//   3. El factor de balance de cada nodo está entre -1 y 1
//   4. Cada registro pertenece al nodo según "claveDe"
export function validar(raiz, claveDe = null) {

    // Devuelve la altura real del subárbol, o -1 si encuentra algún error.
    function revisar(nodo, menor, mayor) {
        if (nodo === null) return 0;

        // Orden de las claves, que deben estar dentro de los límites.
        if (menor !== null && comparar(nodo.clave, menor) <= 0) return -1;
        if (mayor !== null && comparar(nodo.clave, mayor) >= 0) return -1;

        // Un nodo debe tener al menos un registro.
        if (!Array.isArray(nodo.registros) || nodo.registros.length === 0) return -1;

        // Cada registro debe corresponder a la clave del nodo.
        if (claveDe !== null && nodo.registros.some((r) => comparar(claveDe(r), nodo.clave) !== 0)) return -1;

        const hi = revisar(nodo.izq, menor, nodo.clave);
        const hd = revisar(nodo.der, nodo.clave, mayor);
        if (hi === -1 || hd === -1) return -1;

        // La altura guardada debe coincidir con la real.
        const real = 1 + Math.max(hi, hd);
        if (nodo.altura !== real) return -1;

        // Balance AVL.
        if (Math.abs(hi - hd) > 1) return -1;

        return real;
    }

    return revisar(raiz, null, null) !== -1;
}
