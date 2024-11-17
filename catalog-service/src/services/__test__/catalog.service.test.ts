import { Factory } from "rosie";
import { ICatalogRepository } from "../../interface/catalogRepository.interface";
import { Product } from "../../models/product.model";
import { MockCatalogRepository } from "../../repository/mockCatalog.repository";
import { CatalogService } from "../catalog.service";

import { faker } from "@faker-js/faker";
import { ProductFactory } from "../../utils/fixtures";

const mockProduct = (rest?: any) => ({
  name: faker.commerce.productName(),
  description: faker.commerce.productDescription(),
  stock: faker.number.int({ min: 10, max: 100 }),
  price: faker.number.int({ min: 10, max: 100 }),
  ...rest,
});

describe("CatalogService", () => {
  let repository: ICatalogRepository;

  beforeEach(() => {
    repository = new MockCatalogRepository();
  });

  afterEach(() => {
    repository = {} as MockCatalogRepository;
  });

  describe("createProduct", () => {
    it("should create product", async () => {
      const service = new CatalogService(repository);
      const product = mockProduct();

      const result = await service.createProduct(product);
      expect(result).toMatchObject({
        id: expect.any(Number),
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
      });
    });

    it("should throw error if unable to create product", async () => {
      const service = new CatalogService(repository);
      const product = mockProduct();

      jest
        .spyOn(repository, "create")
        .mockImplementationOnce(async () => ({}) as Product);

      await expect(service.createProduct(product)).rejects.toThrow(
        "product creation failed",
      );
    });

    it("should throw error if product already exists", async () => {
      const service = new CatalogService(repository);
      const product = mockProduct();

      jest.spyOn(repository, "create").mockImplementationOnce(async () => {
        throw new Error("product already exists");
      });

      await expect(service.createProduct(product)).rejects.toThrow(
        "product already exists",
      );
    });
  });

  describe("update product", () => {
    it("should update product", async () => {
      const service = new CatalogService(repository);
      const product = mockProduct({
        id: faker.number.int({ min: 1, max: 1000 }),
      });

      const result = await service.updateProduct(product);
      expect(result).toMatchObject(product);
    });

    it("should throw error if product already exists", async () => {
      const service = new CatalogService(repository);
      const product = mockProduct();

      jest.spyOn(repository, "update").mockImplementationOnce(async () => {
        throw new Error("product does not exist");
      });

      await expect(service.updateProduct(product)).rejects.toThrow(
        "product does not exist",
      );
    });
  });

  describe("getProducts", () => {
    it("should return products by offset and limit", async () => {
      const service = new CatalogService(repository);

      const limit = faker.number.int({ min: 10, max: 50 });

      const products = ProductFactory.buildList(limit);

      jest.spyOn(repository, "find").mockImplementationOnce(async () => {
        return products;
      });
      const result = await service.getProducts(limit, 0);
      expect(result).toHaveLength(limit);
      expect(result).toMatchObject(products);
    });
  });

  describe("getProduct", () => {
    it("should return product by id", async () => {
      const service = new CatalogService(repository);
      const product = ProductFactory.build();

      jest.spyOn(repository, "findOne").mockImplementationOnce(async () => {
        return product;
      });
      const result = await service.getProduct(product.id as number);
      expect(result).toMatchObject(product);
    });
  });

  describe("deleteProduct", () => {
    it("should delete product by id", async () => {
      const service = new CatalogService(repository);
      const product = ProductFactory.build();

      jest.spyOn(repository, "delete").mockImplementationOnce(async () => {
        return { id: product.id };
      });
      const result = await service.deleteProduct(product.id as number);
      expect(result).toMatchObject({ id: product.id });
    });
  });
});
