import multer from "multer";


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname + "/public"));    // El join()función para combinar dos rutas, Aca seteamos el destino de la de los archivos que suba es es __dirname(la ruta absoluta C:/src/public...) y la carpeta donde se sube todo.
    },

    filename: (req, file, cb) => {
        cb(null, file.originalname);        // En esta linea ponemos el nombre del archivo original.
    },
});

export const ulploader = multer({ storage });


// https://flaviocopes.com/fix-dirname-not-defined-es-module-scope/
import path from "path";
import { fileURLToPath } from "url";
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);