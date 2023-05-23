import express from "express";
import { ProductManager } from "../productManager.js"


export  const viewsRouter = express.Router();
const productManager = new ProductManager("./src/products.json");

viewsRouter.get("/", async (req, res) => {
    const products = await productManager.getProducts();
    res.render("home", {products});
});

viewsRouter.get("/realTimeProducts", async (req, res) => {
    const products = await productManager.getProducts();
    res.render("realTimeProducts", {products});
});