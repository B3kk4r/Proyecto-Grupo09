//==============================MERGERSORT==============================
// Se establece la manera en la que se va a ordenar un arreglo, de menor a mayor
// Devuelve -1 si a < b, 1 si a > b, y 0 si son iguales.
function compararPorDefecto (a,b){
    return a < b ? -1 : a > b ? 1 : 0; 
}

// Se encarga de unir dos arreglos ya ordenados, comparando los elementos de ambos uno a uno 
function merge(izq, der, comparador){
    const resultado = [];
    let i = 0;
    let j = 0;
    // Toma el elemento menor o igual entre izq y der, lo guarda en resultado y avanza su índice.
    while (i < izq.length && j < der.length){
        if (comparador(izq[i], der[j])<= 0){
        resultado.push(izq[i]);
        i++;
        }
        else {
        resultado.push(der[j]);
        j++;
        }
    }
    // Si sobraron elementos en uno de los arreglos se los agrega tal cual
    while (i < izq.length) resultado.push(izq[i++]);
    while (j < der.length) resultado.push(der[j++]);
    // Devuelve el arreglo final completamente unido y ordenado.
    return resultado;
}
// Divide el arreglo por la mitad de forma recursiva hasta tener partes de 1 elemento,
// y luego las va uniendo en orden usando merge.
export function mergeSort (arreglo, comparador = compararPorDefecto){
    if (arreglo.length <= 1) return arreglo.slice();

    const medio = Math.floor(arreglo.length / 2);
    const izq = mergeSort(arreglo.slice(0, medio), comparador);
    const der = mergeSort(arreglo.slice(medio), comparador);

    return merge(izq, der, comparador);
}

//==============================QUICKSORT==============================
// Intercambia de lugar dos elementos dentro del arreglo (a) usando sus índices i y j.
function intercambiar(a, i, j) {
  const t = a[i];
  a[i] = a[j];
  a[j] = t;
}
// Ordena una sección del arreglo delimitada entre los índices bajo (inicio) y alto (fin).
function ordenarRango(a, bajo, alto, comparador) {
  while (bajo < alto) {
    // Se usa un pivote aleatorio que evita que el algoritmo se vuelva lento con arreglos ya ordenados
    const pivote = a[bajo + Math.floor(Math.random() * (alto - bajo + 1))];
    // Se reorganiza el arreglo entre el indice bajo y alto en tres zonas:
    // menores (izquierda), iguales (centro) y mayores (derecha) respecto al pivote.
    let lt = bajo;
    let gt = alto; 
    let i = bajo;
    while (i <= gt) {
      const c = comparador(a[i], pivote);
      if (c < 0) intercambiar(a, lt++, i++);
      else if (c > 0) intercambiar(a, i, gt--);
      else i++;
    }

    // Se decide cual mitad, izquierda o derecha, es más pequeña, para que se la resuelva de manera recursiva
    // La otra mitad, más grande, se resuelve haciendo uso del while
    if (lt - bajo < alto - gt) {
      ordenarRango(a, bajo, lt - 1, comparador);
      bajo = gt + 1;
    } else {
      ordenarRango(a, gt + 1, alto, comparador);
      alto = lt - 1;
    }
  }
}

// Se devuelve un arreglo nuevo que se ordene desde el índice 0 hasta el final y la devuelve
export function quickSort(arreglo, comparador = compararPorDefecto) {
  const copia = arreglo.slice();
  ordenarRango(copia, 0, copia.length - 1, comparador);
  return copia;
}