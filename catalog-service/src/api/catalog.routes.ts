import express, { NextFunction, Request, Response } from "express";

const router = express.Router();

router.post("/product", (req: Request, res: Response) => {
  return res.status(201).send({});
});
export default router;
