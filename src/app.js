import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";  
import { __dirname } from "./utils.js";              // Importamos la variable __dirname,
import path from "path";


const app = express();          // Asignamos el servidor a una variable.
const port = 8080;

/* --------- Middleware --------- */ 
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static('public'));

/* INICIOOO Configuracion de Handlebars */
app.engine("handlebars", handlebars.engine());      // Inicializamos el motor de plantilla. El engine de la app es el de handlebars.
app.set("views", path.join(__dirname, "views"));    // Indicamos en que parte del proyecto se encuentran las vistas, usando la variable __dirname para usar rutas absolutas, seleccionado la carpeta(views) o archivo y no pifiarle a la direccion. El ultimo archivo es en que carpeta se encuentran las vistas.
app.set("view engine", "handlebars");               // Indicamos que el motor que ya inicializamos es el que vamos a utilziar por defecto.
/* FINNNN Configuracion de Handlebars */




// Ahora guardamos nuestro servidor HTTP en una variable
const httpServer =  app.listen(port, () => {
    console.log(`App listen on port ${port}  http://localhost:8080/ `)}); // Le decimos al servidor en que puerto recivir las peticiones.

const socketServer = new Server(httpServer);    


 let dataProducts = [
    {"id":1,"title":"producto prueba 1","description":"Este es un producto prueba","price":300,"thumbnail":"Sin imagen","code":"abc123","stock":80},
    {"id":2,"title":"producto prueba","description":"Este es un producto prueba","price":200,"thumbnail":"Sin imagen","code":"abc123","stock":25}
];


app.get("/", (req, res) => {
    res.json(dataProducts)
});


app.get("/realTimeProducts", (req, res) => {
    res.render("realTimeProducts");
});

socketServer.on("connection", (socket) => {
    
    console.log("User Conected");

    socket.emit("viewProducts", dataProducts);

    socket.on("addProduct", product => {
        dataProducts.push(product);
        socketServer.sockets.emit("viewProduct", JSON.stringify(dataProducts));
    });

    socket.on("deleteProduct", product => {
        dataProducts = dataProducts.filter(item => item != product) || null;
        socketServer.sockets.emit("viewProducts", dataProducts);
    });

    socket.on("disconnect", ()=> {
        console.log("User Disconected");
    });
});



app.get("*", (req, res) => {
    return res.status(400).json({
        status: "error",
        msj: "No se encuentra ruta !!",
        data: {},
    });
});