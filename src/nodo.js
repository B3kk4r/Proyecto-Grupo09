export function creaNodo(r) {
    return {clave: r.producto, registros:[r], altura: 1, izq: null, der: null};
}

export function comparar (a,b) {
    return a < b ? -1 : a > b ? 1:0;
}

export function insertarNodo (n,r) {
    if (n === null)return crearNodo(r);

    const c = comparar(r.producto, n.clave);
    if (c < 0) n.izq = insertarNodo(n.izq, r);
    else if (c > 0) n.der = insertarNodo(n.der, r);
    else n.registros.push(r);

    n.altura = 1 + Math.max (n.izq?.altura ?? 0, n.der?.altura ?? 0);
    return n;
}

