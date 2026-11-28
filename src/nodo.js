// La clave por defecto del árbol es el nombre del producto.
export function claveProducto(r) {
    return r.producto;
}

// Crea un nodo nuevo con el primer registro de una clave.
// "claveDe" indica de qué campo del registro sale la clave, por defecto, el producto.
export function crearNodo(r, claveDe = claveProducto) {
    return { clave: claveDe(r), registros: [r], altura: 1, izq: null, der: null };
}

// Compara dos claves, devuelve -1 si a < b, 1 si a > b y 0 si son iguales
export function comparar(a, b) {
    return a < b ? -1 : a > b ? 1 : 0;
}

// ---------- Funciones del AVL ----------

// Altura de un nodo, donde una hoja vale 1 y un árbol vacío, null, vale 0.
export function altura(n) {
    return n ? n.altura : 0;
}

// La altura es 1 más la altura del hijo más alto.
export function actualizarAltura(n) {
    n.altura = 1 + Math.max(altura(n.izq), altura(n.der));
}

// Diferencia de alturas (izquierda - derecha). En un AVL siempre está entre -1 y 1.
export function factorBalance(n) {
    return n ? altura(n.izq) - altura(n.der) : 0;
}

// Rotación a la derecha y el hijo izquierdo pasa a ser la nueva raíz del subárbol.
export function rotarDerecha(y) {
    const x = y.izq;
    y.izq = x.der;
    x.der = y;
    actualizarAltura(y); // primero el que quedó abajo
    actualizarAltura(x);
    return x;
}

// Rotación a la izquierda: el hijo derecho pasa a ser la nueva raíz del subárbol.
export function rotarIzquierda(x) {
    const y = x.der;
    x.der = y.izq;
    y.izq = x;
    actualizarAltura(x);
    actualizarAltura(y);
    return y;
}

// Recalcula la altura del nodo y, si está desbalanceado, lo corrige con rotaciones.
// Devuelve la nueva raíz del subárbol.
export function rebalancear(n) {
    actualizarAltura(n);
    const fb = factorBalance(n);

    // Pesa a la izquierda
    if (fb > 1) {
        if (factorBalance(n.izq) < 0) n.izq = rotarIzquierda(n.izq); // caso izquierda-derecha
        return rotarDerecha(n);                                      // caso izquierda-izquierda
    }

    // Pesa a la derecha
    if (fb < -1) {
        if (factorBalance(n.der) > 0) n.der = rotarDerecha(n.der);   // caso derecha-izquierda
        return rotarIzquierda(n);                                    // caso derecha-derecha
    }

    return n; // ya estaba balanceado
}

// Se inserta un registro y devuelve la raíz del subárbol (ya balanceado)
export function insertarNodo(n, r, claveDe = claveProducto) {
    if (n === null) return crearNodo(r, claveDe); // se crea el nodo si la posición está vacía

    const c = comparar(claveDe(r), n.clave);
    if (c < 0) n.izq = insertarNodo(n.izq, r, claveDe);       // menor, entonces va a la izquierda
    else if (c > 0) n.der = insertarNodo(n.der, r, claveDe);  // mayor, entonces va a la derecha
    else {
        n.registros.push(r); // misma clave, se agrega a la lista del nodo
        return n;            // no cambia la forma del árbol
    }

    return rebalancear(n);
}