import { Factory } from "rosie";
import { Product } from "../../models/product.model";
import { faker } from "@faker-js/faker/.";

export const ProductFactory = new Factory<Product>()
  .attr("id", () => faker.number.int({ min: 1 }))
  .attr("name", () => faker.commerce.productName())
  .attr("description", () => faker.commerce.productDescription())
  .attr("stock", () => faker.number.int({ min: 100, max: 1000 }))
  .attr("price", () => faker.number.int({ min: 10, max: 2000 }));
