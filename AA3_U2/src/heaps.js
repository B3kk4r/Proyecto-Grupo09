
// Modulo de Heaps binarios.
// Permite trabajar con Min-Heap y Max-Heap utilizando un arreglo.

function compararNumeros(a, b) {
    return a - b;
}

export class Heap {
    constructor(tipo = 'max', comparador = compararNumeros) {
        if (tipo !== 'min' && tipo !== 'max') {
            throw new Error('El tipo de Heap debe ser min o max');
        }

        if (typeof comparador !== 'function') {
            throw new TypeError('El comparador debe ser una funcion');
        }

        this.tipo = tipo;
        this.comparador = comparador;
        this.elementos = [];
    }

    // Calcula las posiciones de los nodos dentro del arreglo.
    indicePadre(indice) {
        return Math.floor((indice - 1) / 2);
    }

    indiceHijoIzquierdo(indice) {
        return 2 * indice + 1;
    }

    indiceHijoDerecho(indice) {
        return 2 * indice + 2;
    }

    // Determina que elemento debe estar mas cerca de la raiz.
    tienePrioridad(primero, segundo) {
        const resultado = this.comparador(primero, segundo);

        if (typeof resultado !== 'number' || !Number.isFinite(resultado)) {
            throw new TypeError('El comparador debe devolver un numero valido');
        }

        if (this.tipo === 'min') {
            return resultado < 0;
        }

        return resultado > 0;
    }

    intercambiar(posicionA, posicionB) {
        const temporal = this.elementos[posicionA];
        this.elementos[posicionA] = this.elementos[posicionB];
        this.elementos[posicionB] = temporal;
    }

    // Sube un elemento hasta recuperar la propiedad del Heap.
    subir(indice) {
        while (indice > 0) {
            const padre = this.indicePadre(indice);

            if (!this.tienePrioridad(this.elementos[indice], this.elementos[padre])) {
                break;
            }

            this.intercambiar(indice, padre);
            indice = padre;
        }
    }

    // Baja un elemento comparandolo con sus dos hijos.
    bajar(indice) {
        const cantidad = this.elementos.length;

        while (true) {
            const izquierdo = this.indiceHijoIzquierdo(indice);
            const derecho = this.indiceHijoDerecho(indice);
            let mejorPosicion = indice;

            if (
                izquierdo < cantidad &&
                this.tienePrioridad(this.elementos[izquierdo], this.elementos[mejorPosicion])
            ) {
                mejorPosicion = izquierdo;
            }

            if (
                derecho < cantidad &&
                this.tienePrioridad(this.elementos[derecho], this.elementos[mejorPosicion])
            ) {
                mejorPosicion = derecho;
            }

            if (mejorPosicion === indice) {
                break;
            }

            this.intercambiar(indice, mejorPosicion);
            indice = mejorPosicion;
        }
    }

    // Inserta un nuevo elemento y lo acomoda en el Heap.
    insertar(elemento) {
        this.elementos.push(elemento);
        this.subir(this.elementos.length - 1);
    }

    // Consulta la raiz sin modificar el Heap.
    obtenerRaiz() {
        if (this.estaVacio()) {
            return null;
        }

        return this.elementos[0];
    }

    // Extrae la raiz y reorganiza los elementos restantes.
    extraerRaiz() {
        if (this.estaVacio()) {
            return null;
        }

        const raiz = this.elementos[0];
        const ultimo = this.elementos.pop();

        if (!this.estaVacio()) {
            this.elementos[0] = ultimo;
            this.bajar(0);
        }

        return raiz;
    }

    // Construye el Heap desde un arreglo en tiempo O(n).
    construir(desdeArreglo) {
        if (!Array.isArray(desdeArreglo)) {
            throw new TypeError('Se necesita un arreglo para construir el Heap');
        }

        this.elementos = [...desdeArreglo];

        const ultimoPadre = Math.floor(this.elementos.length / 2) - 1;

        for (let indice = ultimoPadre; indice >= 0; indice--) {
            this.bajar(indice);
        }
    }

    obtenerCantidad() {
        return this.elementos.length;
    }

    estaVacio() {
        return this.elementos.length === 0;
    }

    // Devuelve una copia para evitar modificar el Heap desde fuera.
    obtenerElementos() {
        return [...this.elementos];
    }

    // Comprueba la propiedad del Heap en todos sus nodos.
    esValido() {
        for (let indice = 0; indice < this.elementos.length; indice++) {
            const izquierdo = this.indiceHijoIzquierdo(indice);
            const derecho = this.indiceHijoDerecho(indice);

            if (
                izquierdo < this.elementos.length &&
                this.tienePrioridad(this.elementos[izquierdo], this.elementos[indice])
            ) {
                return false;
            }

            if (
                derecho < this.elementos.length &&
                this.tienePrioridad(this.elementos[derecho], this.elementos[indice])
            ) {
                return false;
            }
        }

        return true;
    }
}

export class MinHeap extends Heap {
    constructor(comparador = compararNumeros) {
        super('min', comparador);
    }
}

export class MaxHeap extends Heap {
    constructor(comparador = compararNumeros) {
        super('max', comparador);
    }
}
