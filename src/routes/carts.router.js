import express from "express";
import { ProductManager } from "../productManager.js"

export const cartsRouter = express.Router();


cartsRouter.post("/", async(req, res) => {
    const data = req.body;
    const instanceManager = new ProductManager("./src/carts.json");
    const flagFound = await instanceManager.addCart(data);
    flagFound ? res.status(200).send('Product added successfully') : res.status(400).send('Error in uploaded data');
});


cartsRouter.get("/:cid", async (req, res) => {
    const instanceManager = new ProductManager("./src/carts.json");
    const viewCart = await instanceManager.getProducts();
    const { cid } = req.params;
    const idFound = viewCart.find(element => element.id == cid);
    idFound ?  res.status(200).send(idFound) : res.status(404).send('Not Found');

});


cartsRouter.post("/:cid/product/:pid", async (req,res) => {
    let productsCart = req.body;
    let { cid } = req.params;
    cid = parseInt(cid);
    let { pid } = req.params;
    pid = parseInt(pid);
    const instanceManager = new ProductManager("./src/carts.json");     // Instanciamos una clase, pasando como parametro la ruta que tiene el archivo carts.json con los carritos de compra.
    const viewCart = await instanceManager.getProducts();
    const cartFound = viewCart.find(item => item.id == cid);            // Bucamos el carrito, por el id que recivimos por params, usando la funcion find cuando encuentre la igualdad.
    if(cartFound) {                                                                 // Preguntamos si se encontro la busqueda anterior.
        const productFound = cartFound.products.find(item => item.product == pid);  // Buscamos si se encuentra el ID de producto, dentro del carrito.
        let newProductCart = [];                                                    // Creamo un array, para los productos del carrito.
        if(productFound){                                                           // Preguntamos si ya existia ese producto en el carrito.        
            let newQuantity = productsCart.quantity + productFound.quantity         // Creamos la variable nueva cantidad y sumamos la cantidad del producto que ya estaba mas la del nuevo producto.
            newProductCart.push(...cartFound.products);                             // Desparramamos las propiedades del carrito encontrado en el array.
            newProductCart.map(item => {                                            // Creamos un nuevo array a partir de la funcion que le pasamos.
                if(element.product == productsCart.product){
                    element.quantity = newQuantity;
                }
            });
        }
        else {                                                                      
            newProductCart.push(...cartFound.products);                             // Desparramamos las propiedades del producto para insertarla en el array.
            newProductCart.push( productsCart );                                    // Introducimos las propiedades enviadas en el body
        }
        const flagFound = await instanceManager.updateProduct(cid, { "products" : newProductCart});
        flagFound ? res.status(200).send("Product added/modified succesfullly") : res.status(404).send("not Found");
    } 
    else{
        res.status(404).send("Not Found");
    }
});