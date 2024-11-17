import { ICatalogRepository } from "../interface/catalogRepository.interface";
import { Product } from "../models/product.model";

export class MockCatalogRepository implements ICatalogRepository {
  async create(data: Product): Promise<Product> {
    const mockProduct: Product = {
      id: 123,
      ...data,
    };

    return mockProduct;
  }
  async update(data: Product): Promise<Product> {
    return data;
  }
  async delete(id: any): Promise<any> {
    return id;
  }
  async find(limit: number, offset: number): Promise<Product[]> {
    return [];
  }
  async findOne(id: number): Promise<Product> {
    return { id } as Product;
  }
}
