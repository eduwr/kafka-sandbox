import express, { type Request, type Response } from "express";
import { CatalogService } from "../services/catalog.service";
import { CatalogRepository } from "../repository/catalog.repository";
import { RequestValidator } from "../utils/requestValidator";
import { CreateProductRequest, UpdateProductRequest } from "../dto/product.dto";

const router = express.Router();

export const catalogService = new CatalogService(new CatalogRepository());

router.post("/products", async (req: Request, res: Response) => {
  try {
    const { errors, input } = await RequestValidator(
      CreateProductRequest,
      req.body
    );

    if (errors) return res.status(400).json(errors);

    const data = await catalogService.createProduct(input);

    return res.status(201).json(data);
  } catch (error) {
    const err = error as Error;
    return res.status(500).json(err.message);
  }
});

router.patch("/products/:id", async (req: Request, res: Response) => {
  try {
    const { errors, input } = await RequestValidator(
      UpdateProductRequest,
      req.body
    );

    const id = parseInt(req.params.id) || 0;

    if (errors) return res.status(400).json(errors);

    const data = await catalogService.updateProduct({ id, ...input });

    return res.status(200).json(data);
  } catch (error) {
    const err = error as Error;
    return res.status(500).json(err.message);
  }
});

router.get("/products", async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query["limit"]);
    const offset = Number(req.query["offset"]);

    const data = await catalogService.getProducts(limit, offset);

    return res.status(200).json(data);
  } catch (error) {
    const err = error as Error;
    return res.status(500).json(err.message);
  }
});

router.get("/products/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id) || 0;

    const data = await catalogService.getProduct(id);

    return res.status(200).json(data);
  } catch (error) {
    const err = error as Error;
    return res.status(500).json(err.message);
  }
});

router.delete("/products/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id) || 0;

    const data = await catalogService.deleteProduct(id);

    return res.status(200).json(data);
  } catch (error) {
    const err = error as Error;
    return res.status(500).json(err.message);
  }
});

export default router;
