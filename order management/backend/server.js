const express = require("express");

const { v4: uuidv4 } = require("uuid");

const app = express();

const PORT = process.env.PORT || 8080;

const bodyParser = require("body-parser");

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

let products = new Map();
let orders = new Map();

app.post("/products", (req, res) => {
  const { name, price, stock } = req.body;
  if (!name || !price || !stock) {
    return res
      .status(400)
      .json({ error: "name, price, and stock are required" });
  }
  const id = uuidv4();
  const newProduct = { id, name, price, stock };
  products.set(id, newProduct);
  res.status(201).json(newProduct);
});

app.post("/orders", (req, res) => {
  const { product_id, quantity } = req.body;
  if (!product_id || !quantity) {
    return res
      .status(400)
      .json({ error: "product ID and quantity are required" });
  }
  const product = products.get(product_id);
  if (!product) {
    return res.status(404).json({ error: "product not found" });
  }
  if (product.stock < quantity) {
    return res.status(400).json({ error: "Insufficient stock" });
  }

  const order_id = uuidv4();
  const total_price = product.price * quantity;
  const newOrder = { order_id, product_id, quantity, total_price };

  product.stock -= quantity;

  orders.set(order_id, newOrder);
  res.status(201).json(newOrder);
});

app.get("/orders/:id", (req, res) => {
  const { id } = req.params;
  const order = orders.get(id);
  if (!order) {
    return res.status(400).json({ error: "order not found" });
  }
  res.status(200).json(order);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
