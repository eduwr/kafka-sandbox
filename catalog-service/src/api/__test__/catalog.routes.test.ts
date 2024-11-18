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

describe("Catalog Routes", () => {
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
        "price must not be less than 1,price must be a number"
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

  describe("PATCH /products", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it("should update the product successfully", async () => {
      const product = ProductFactory.build();
      const body = {
        name: product.name,
        price: product.price,
        stock: product.stock,
      };
      jest
        .spyOn(catalogService, "updateProduct")
        .mockImplementation(async () => product);

      const response = await request(app)
        .patch(`/products/${product.id}`)
        .send(body)
        .set("Accept", "application/json");

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(product);
    });

    it("should response with validation error 400", async () => {
      const product = ProductFactory.build();
      const body = {
        name: product.name,
        price: -1,
        stock: product.stock,
      };
      jest
        .spyOn(catalogService, "updateProduct")
        .mockImplementation(async () => product);

      const response = await request(app)
        .patch(`/products/${product.id}`)
        .send(body)
        .set("Accept", "application/json");

      expect(response.status).toEqual(400);
      expect(response.body).toEqual("price must not be less than 1");
    });

    it("should response with internal error 500", async () => {
      const product = ProductFactory.build();
      const body = {
        name: product.name,
        price: product.price,
        stock: product.stock,
      };

      jest.spyOn(catalogService, "updateProduct").mockImplementation(() => {
        throw new Error("product update failed");
      });

      const response = await request(app)
        .patch(`/products/${product.id}`)
        .send(body)
        .set("Accept", "application/json");

      expect(response.status).toEqual(500);
      expect(response.body).toEqual("product update failed");
    });
  });

  describe("GET /products?limit=0&offset=0", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it("should return a range of products based on limit and offset", async () => {
      const limit = faker.number.int({ min: 10, max: 50 });
      const products = ProductFactory.buildList(limit);

      const getProductsSpy = jest
        .spyOn(catalogService, "getProducts")
        .mockImplementation(async () => products);

      const response = await request(app)
        .get(`/products?limit=${limit}&offset=0`)
        .set("Accept", "application/json");

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(products);
      expect(getProductsSpy).toHaveBeenCalledWith(limit, 0);
    });

    it("should response with internal error 500", async () => {
      const limit = faker.number.int({ min: 10, max: 50 });

      const getProductsSpy = jest
        .spyOn(catalogService, "getProducts")
        .mockImplementation(async () => {
          throw new Error("internal server error");
        });

      const response = await request(app)
        .get(`/products?limit=${limit}&offset=0`)
        .set("Accept", "application/json");

      expect(response.status).toEqual(500);
      expect(response.body).toEqual("internal server error");
      expect(getProductsSpy).toHaveBeenCalledWith(limit, 0);
    });
  });

  describe("GET /products/:id", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it("should return a product by id", async () => {
      const product = ProductFactory.build();

      const getProductSpy = jest
        .spyOn(catalogService, "getProduct")
        .mockImplementation(async () => product);

      const response = await request(app)
        .get(`/products/${product.id}`)
        .set("Accept", "application/json");

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(product);
      expect(getProductSpy).toHaveBeenCalledWith(product.id);
    });

    it("should response with internal error 500", async () => {
      const product = ProductFactory.build();

      const getProductsSpy = jest
        .spyOn(catalogService, "getProduct")
        .mockImplementation(async () => {
          throw new Error("internal server error");
        });

      const response = await request(app)
        .get(`/products/${product.id}`)
        .set("Accept", "application/json");

      expect(response.status).toEqual(500);
      expect(response.body).toEqual("internal server error");
      expect(getProductsSpy).toHaveBeenCalledWith(product.id);
    });
  });

  describe("DELETE /products/:id", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it("should delete a product by id", async () => {
      const product = ProductFactory.build();

      const deleteProductSpy = jest
        .spyOn(catalogService, "deleteProduct")
        .mockImplementation(async () => product);

      const response = await request(app)
        .delete(`/products/${product.id}`)
        .set("Accept", "application/json");

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(product);
      expect(deleteProductSpy).toHaveBeenCalledWith(product.id);
    });

    it("should response with internal error 500", async () => {
      const product = ProductFactory.build();

      const deleteProductSpy = jest
        .spyOn(catalogService, "deleteProduct")
        .mockImplementation(async () => {
          throw new Error("delete product failed");
        });

      const response = await request(app)
        .delete(`/products/${product.id}`)
        .set("Accept", "application/json");

      expect(response.status).toEqual(500);
      expect(response.body).toEqual("delete product failed");
      expect(deleteProductSpy).toHaveBeenCalledWith(product.id);
    });
  });
});
