try {
  process.loadEnvFile();
} catch (e) {
  console.warn(".env file not found, using default values.");
}

const jsonServer = require("json-server");
const morgan = require("morgan");

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const PORT = process.env.PORT || 5005;

server.use(middlewares);
server.use(morgan("dev"));
server.use((req, res, next) => {
  // Middleware to disable CORS
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

server.get("/products/category/:categoryId", (req, res) => {
  const categoryId = Number(req.params.categoryId);

  const db = router.db;
  const products = db.get("products").value();

  res.json(
    products.filter(p => p.categoryId === categoryId)
  );
});

server.use(router);

server.listen(PORT, () => {
  console.log(`JSON Server is running at port ${PORT}`);
});
