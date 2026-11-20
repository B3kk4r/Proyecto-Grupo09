import { open } from 'node:fs/promises';

// Busca un registro por ID recorriendo el arreglo.
export function buscarSecuencialArreglo(registros, idBuscado) {
    let comparaciones = 0;

    for (const registro of registros) {
        comparaciones++;

        if (registro.id === idBuscado) {
            return { registro, comparaciones };
        }
    }

    return { registro: null, comparaciones };
}

// Lee el archivo linea por linea hasta encontrar el ID.
export async function buscarSecuencialArchivo(rutaArchivo, idBuscado) {
    const archivo = await open(rutaArchivo, 'r');
    let comparaciones = 0;

    try {
        for await (const linea of archivo.readLines()) {
            if (linea.trim() === '') continue;

            const registro = JSON.parse(linea);
            comparaciones++;

            if (registro.id === idBuscado) {
                return { registro, comparaciones };
            }
        }
    } finally {
        await archivo.close();
    }

    return { registro: null, comparaciones };
}
