import {openSync, closeSync, readSync, readFileSync} from 'node:fs';

const SALTO_DE_LINEA = 0x0a;
// Recorre el archivo en bytes y devuelve la posicion ,en bytes, donde empieza cada registro
// Con bytes se evita el usar caracteres, que ocupa más bytes para la ñ y las tildes
export function contruirIndice(ruta){
    const contenido = readFileSync(ruta);
    const posiciones = [];
    let inicio = 0; // Marca el byte donde empieza la línea actual, justo después del último salto


    for (let i = 0; i < contenido.length; i++){
        if(contenido[i] === SALTO_DE_LINEA){
            if(i > inicio) posiciones.push(inicio);// Se ignoran líneas vacias
            inicio = i + 1;
        }
    }
    if(inicio < contenido.length) posiciones.push(inicio);// Línea sin salto final

    return posiciones;
}

// Abre el archivo, construye el índice y devuelve las funciones para que se pueda leer
export function abrirArchivo(ruta){
    const posiciones = contruirIndice(ruta);
    const fd = openSync(ruta, 'r');

    // Lee el registro que empieza en bytes y lo devuelve como objeto
    // Se leen los bytes de una línea concreta, no todo el archivo
    function leerRegistro(posicion){
        let tamano = 512;
        for(;;){
            const buffer = Buffer.alloc(tamano); // Establece el tamaño disponible para albergar un línea
            // Lee los bytes del archivo desde 'posicion', los guarda en el búfer y devuelve cuántos bytes se leyeron 
            const leidos = readSync(fd, buffer, 0, tamano, posicion); 
            const fin = buffer.indexOf(SALTO_DE_LINEA); // Busca un salto de línea
            // Si se encontró un salto de línea o se llegó al final del archivo, decodifica desde el inicio del búfer hasta el corte encontrado
            if(fin !== -1 || leidos < tamano){
                const linea = buffer.toString('utf8', 0, fin !== -1 ? fin : leidos);
                return JSON.parse(linea);
            }
            tamano *= 2; // Se usa para leer un línea más larga, que el bloque actual no aguantaría
        }
    }

    return {
        total: posiciones.length,
        posiciones,
        leerRegistro,
        leerPorIndice: (i) => leerRegistro(posiciones[i]),
        cerrar: () => closeSync(fd),
    };
}