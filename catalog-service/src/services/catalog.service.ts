import { ICatalogRepository } from "../interface/catalogRepository.interface";

export class CatalogService {
  constructor(private repository: ICatalogRepository) {}
  async createProduct(input: any) {
    const data = await this.repository.create(input);

    if (!data.id) {
      throw new Error("product creation failed");
    }

    return data;
  }
  async updateProduct(input: any) {
    const data = await this.repository.update(input);
    // TODO: emit event to update record in Elastic Search
    return data;
  }

  async getProducts(limit: number, offset: number) {
    // TODO: instead of getting from the repo we will get from ElasticSearch
    const products = await this.repository.find(limit, offset);
    return products;
  }
  async getProduct(id: number) {
    // TODO: instead of getting from the repo we will get from ElasticSearch
    const product = await this.repository.findOne(id);
    return product;
  }
  async deleteProduct(id: number) {
    const product = await this.repository.delete(id);
    // TODO: delete record from elastic search
    return product;
  }
}
