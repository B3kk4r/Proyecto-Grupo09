export function crearNodo(r) { // Crea un nodo nuevo con el primer registro de un producto
    return {clave: r.producto, registros:[r], altura: 1, izq: null, der: null};
}

// Compara dos claves, devuelve -1 si a < b, 1 si a > b y 0 si son iguales
export function comparar (a,b) {
    return a < b ? -1 : a > b ? 1:0;
}

// Se inserta un registro y devuelve la raíz del subárbol
export function insertarNodo (n,r) {
    if (n === null)return crearNodo(r); //Se crea el nodo si la posición es vacia

    //Se compara el producto nuevo con la clave del nodo actual
    const c = comparar(r.producto, n.clave); 
    if (c < 0) n.izq = insertarNodo(n.izq, r); //menor, va a la izquierda
    else if (c > 0) n.der = insertarNodo(n.der, r); //mayor, va a la derecha
    else n.registros.push(r); //se agrega a la lista del nodo si es igual

    // La altura es 1 más la altura del hijo más alto
    n.altura = 1 + Math.max (n.izq?.altura ?? 0, n.der?.altura ?? 0);
    return n;
}
