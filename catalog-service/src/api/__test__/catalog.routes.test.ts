import request from "supertest";

import express from "express";
import { faker } from "@faker-js/faker";
import catalogRoutes, { catalogService } from "../catalog.routes";
import { ProductFactory } from "../../utils/fixtures";
const app = express();

app.use(express.json());
app.use(catalogRoutes);

const mockRequest = () => ({
  name: faker.commerce.productName(),
  description: faker.commerce.productDescription(),
  stock: faker.number.int({ min: 10, max: 100 }),
  price: faker.number.int({ min: 10, max: 100 }),
});

describe.only("Catalog Routes", () => {
  describe("POST /products", () => {
    it("should create the product successfully", async () => {
      const body = mockRequest();
      const product = ProductFactory.build();
      jest
        .spyOn(catalogService, "createProduct")
        .mockImplementationOnce(async () => product);

      const response = await request(app)
        .post("/products")
        .send(body)
        .set("Accept", "application/json");

      expect(response.status).toEqual(201);
      expect(response.body).toEqual(product);
    });

    it("should response with validation error 400", async () => {
      const body = mockRequest();
      // @ts-expect-error
      delete body.price;

      const response = await request(app)
        .post("/products")
        .send(body)
        .set("Accept", "application/json");

      expect(response.status).toEqual(400);
      expect(response.body).toContain(
        "price must not be less than 1,price must be a number",
      );
    });

    it("should response with internal error 500", async () => {
      const body = mockRequest();

      jest
        .spyOn(catalogService, "createProduct")
        .mockImplementationOnce(async () => {
          throw new Error("product creation failed");
        });

      const response = await request(app)
        .post("/products")
        .send(body)
        .set("Accept", "application/json");

      expect(response.status).toEqual(500);
    });
  });
});
