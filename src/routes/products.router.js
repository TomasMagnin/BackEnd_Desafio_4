import express from "express";
import { ProductManager } from "../productManager.js"

export const productsRouter = express.Router();


productsRouter.get("/", async(req, res) => {
    const instanceManager = new ProductManager("./src/products.json");
    const viewProducts = await instanceManager.getProducts();
    if(viewProducts) {
        const { limit } = req.query;
        limit ? res.status(200).send(viewProducts.filter(item => item.id <= limit)) : res.status(200).send(viewProducts);
    } else {
        res.status(400).send("NotFound");
    }
});


productsRouter.get(`/:pid`, async (req, res) => {
    const instanceManager = new ProductManager("./src/products.json")    // Creo una nueva instancia u objeto de la clase ProductManager.
    const viewProducts = await instanceManager.getProducts();
    const { pid } = req.params;
    const idSerch = viewProducts.find(item => item.id == pid);
    idSerch ? res.status(200).send(idSerch) : res.status(404).send("Not Found");
});


productsRouter.post("/", async (req, res) => {
    const data = req.body;
    const instanceManager = new ProductManager("./src/products.json");
    const flagValidator = await instanceManager.addProduct(data.title, data.description, data.code, data.price, data.status, data.stock, data.category, data.thumbnail);
    flagValidator ? res.status(200).send(`Product added successfuly`) : res.status(400).send("Error Upload");
});


productsRouter.put("/:id", async (req, res) => {
    let { pid } = req.params;
    pid = parseInt(pid);
    const data = req.body;
    const instanceManager =  new ProductManager("./src/products.json");
    const flagFound = await instanceManager.updateProduct(pid, data);
    flagFound ? res.status(200).send('Product modified successfully') : res.status(404).send("Not Found");
});

productsRouter.delete("/:pid", async (req, res) => {
    const { pid } = req.params;
    const instanceManager =  new ProductManager("./src/products.json");
    const flagFound = await instanceManager.deleteProduct(pid);
    flagFound ? res.status(200).send('Product Delete successfully') : res.status(404).send("Not Found");
});