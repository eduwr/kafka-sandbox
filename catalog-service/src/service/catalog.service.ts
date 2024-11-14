import { ICatalogRepository } from "../interface/catalogRepository.interface";

export class CatalogService {
  constructor(private repository: ICatalogRepository) {}
  createProduct(input: any) {}
  updateProduct(input: any) {}
  getProducts(limit: number, offset: number) {}
  getproduct(id: number) {}
  deleteProduct(id: number) {}
}
