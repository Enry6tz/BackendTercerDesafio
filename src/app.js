const express = require("express");
const productManager = require("./product-manager.js")

// Crea una instancia de Express
const app = express();
const PUERTO = 8080;
const ProductManager = new productManager("./src/products.JSON");
// acceso para trabajar con datos complejos
app.use(express.urlencoded({extended: true}))


app.get("/products", async (req, res) => {
  try {
    let limit = parseInt(req.query.limit);
    const products = await ProductManager.getProducts();
    // Si limit es falsy, entonces devolvemos todos los productos.
    const limitedProducts = limit ? products.slice(0, limit) : products;
    res.status(200).send({ status: "success", data: limitedProducts });
    console.log("Productos obtenidos con éxito");
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).send({ status: "error", error: "Error interno del servidor" });
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    // Lógica para buscar el producto por su ID
    const productoEncontrado = await ProductManager.getProductById(productId);
    if (!productoEncontrado) {
      // Si el producto no se encuentra, envía un código de estado 404
      return res.status(404).json({ status: "error", message: "Producto no encontrado" });
    }
    res.json({ status: "success", data: productoEncontrado });
  } catch (error) {
    console.error("Error al obtener el producto:", error);
    res.status(500).send({ status: "error", error: "Error interno del servidor" });
  }
});


//Escucha en el puerto especificado
app.listen(PUERTO, () => {
  console.log(`Servidor escuchando en el puerto ${PUERTO}`);
});