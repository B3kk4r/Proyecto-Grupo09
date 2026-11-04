
 // Recorre el árbol: izquierda, raíz y derecha.
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

// Recorre el árbol: raíz, izquierda y derecha.
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

// Recorre el árbol: izquierda, derecha y raíz.
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
