import { Router } from "express";
import ProductController from "../dao/product.controller.js";

const router = Router();

const controller = new ProductController();

const midd1 = (req, res, next) => {
  console.log("se recibio una solicitud GET");
  next();
};

router.get('/', async (req, res) => {
    const { limit = 10, page = 1, query, sort } = req.query;
    try {
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : {}
        };
        const response = await controller.get(options, query);
        res.status(200).json({
            status: 'success',
            payload: response.docs,
            totalPages: response.totalPages,
            prevPage: response.prevPage,
            nextPage: response.nextPage,
            page: response.page,
            hasPrevPage: response.hasPrevPage,
            hasNextPage: response.hasNextPage,
            prevLink: response.hasPrevPage ? `api/products?page=${response.prevPage}&limit=${limit}` : null,
            nextLink: response.hasNextPage ? `api/products?page=${response.nextPage}&limit=${limit}` : null,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: error.message });
    }});

router.get("/paginated/:pag?", async (req, res) => {
    const pg = req.params.pag || 1;
    const data = await controller.getPaginated(pag);
    res.status(200).send({ error: null, data });
});

router.get("/all", async (req, res) => {
    const data = await controller.getAll();
    res.status(200).send({ error: null, data });
});

router.post("/", async (req, res) => {
    const { title, description, code, price, stock, category, thumbnails } =
    req.body;
    const status = req.body.status === undefined ? true : req.body.status;

  if (
    !title ||
    !description ||
    !code ||
    !price ||
    status === undefined ||
    !stock ||
    !category
    ) {
    return res.status(400).send({ error: "Faltan campos obligatorios", data: [] });}

    const newProduct = {
    id: id(10),
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails: thumbnails || [],
  };

  try {
    const process = await controller.add(newProduct);
    res.status(200).send({ error: null, data: process });
  } catch (error) {
    console.error("Error al agregar el producto:", error);
    res.status(500).send({ error: "Error al agregar el producto", data: [] });
  }
});

router.put("/:pid", async (req, res) => {
  const productId = req.params.pid;
  const filter = { _id: productId };
  const updated = req.body;
  const options = { new: true };

  const process = await controller.update(filter, updated, options);
  if (process) {
    res.status(200).send({ error: null, data: process });
  } else {
    res.status(404).send({ error: "No se encuentra el producto", data: [] });
  }
});

router.delete("/:pid", async (req, res) => {
  const productId = req.params.pid;
  const filter = { _id: productId };
  const options = {};

  try {
    const product = await controller.delete(filter, options);

    if (!product) {
      return res.status(404).send({ error: "Product not found", data: null });
    }
    res.status(200).send({ error: null, data: product });
  } catch (error) {
    console.error("Error al borrar el producto:", error);
    res.status(500).send({ error: "Error al borrar el producto", data: null });
  }
});

export default router;