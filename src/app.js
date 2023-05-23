import express from "express";                                    // Importamos el modulo de servidor en express.
import { Server } from 'socket.io';
import handlebars from "express-handlebars";
import { __dirname, __filename } from "./utils.js";                           // Importamos la variable __dirname, de la configuracion de MULTER para poder subir archivos, LA variable dirname, es una variable de Node con un path aboluto a la carpeta que le indicamos.
import path from "path";
import { productsRouter } from "./routes/products.router.js";     // Importamos los endpoint Productos.
import { cartsRouter } from "./routes/carts.router.js";           // Importamos los endpoint Carts.
import { viewsRouter } from "./routes/views.router.js";
import { ProductManager } from "./productManager.js";
import http from "http";


const app = express();                                              // Asignamos la funcionaldiad del servidor en la app express.
const port = 8080;   
const httpServer = http.createServer(app);                          // Asignamos el N° de puerto a una varibale. 
const socketServer = new Server(httpServer);                        // Guardamos nuestro servidor socket en una variable
const productManager = new ProductManager("./products.json");





// Middleware 
app.use(express.json());                                        // Declaramos que el servidor utiliza formato JSON por defecto.
app.use(express.urlencoded({extended: true}));                  // Declaramos que extendemos lo que recive por URL, para recivir datos complejos y porder mapearlos desde la URL.
app.use(express.static("./public"));                              // Usamos una carpeta public, para guardar archivos estaticos, donde puede acceder el usuario. El nombre del directorio no forma parte de la URL.

//  Configuracion de Handlebars 
app.engine("handlebars", handlebars.engine());      // Inicializamos el motor de plantilla. El engine de la app es el de handlebars.
app.set("views", path.join(__dirname, "views"));    // Indicamos en que parte del proyecto se encuentran las vistas, usando la variable __dirname para usar rutas absolutas, seleccionado la carpeta(views) o archivo y no pifiarle a la direccion. El ultimo archivo es en que carpeta se encuentran las vistas.
app.set("view engine", "handlebars");               // Indicamos que el motor que ya inicializamos es el que vamos a utilziar por defecto.

// Seteo de Rutas
app.use("/api/products", productsRouter);                       // Le decimos a la app, que use todo lo que esta en la ruta api/products, lo maneja productsRouter.
app.use("/api/carts", cartsRouter);                             // Le decimos a la app, que use todo lo que esta en la ruta api/carts, lo maneja cartsRouter.
app.use("/", viewsRouter);
app.use("/realTimeProducts", viewsRouter);

app.listen(port, ()=> {
    console.log(`App listen on port: ${port}  http://localhost:${port} `);  // Le decimos al servidor en que puerto recivir las peticiones.
});

socketServer.on("connection", (socket) => {
    console.log(`Nueva coneccion establecida con el cliene ID + ${socket.id}`);

    // Recivimos del Back
    socket.on("front a servidor", async (newProduct) => {
        try{
            await productManager.addProduct(newProduct);
            const dataProducts = await productManager.getProducts();

            // Responde el servidor
            socketServer.emit("updatedProducts", {dataProducts})
        }
        catch (error) {
            console.log(error);
        }
    });

    socket.on("deleteProduct", async (id) => {
        try {
            const parseId = parseInt(id, 10); 
            await productManager.deleteProduct(parseId);
            socket.emit('productDeleted', { message: 'Producto eliminado exitosamente' })
            
            // Brodcast y actualizacion a todos los clientes
            const dataProducts =  productManager.getProducts();
            socketServer.emit("updatedProducts", { dataProducts });
        } catch (error) {
            console.log("Error al eliminar producto", error);
            socket.emit('productDeleteError', { error: 'Ocurrió un error al eliminar el producto' });
        }
    });
});



app.get("*", (req, res) => {                                    // Si no machea con ninguna ruta entra a esta middleware default.
    return res.status(400).json({
        status: "error",                                        // En caso positivo succes.
        msj: "No se encuentra ruta URL",
        data: {},                                               // En caso positivo serian los datos.
    });
});