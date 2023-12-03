import { Injectable } from "@nestjs/common";
import { Page, PageOptions } from "infrastructure/common/page";
import { Products } from "infrastructure/database/mapper/Products.entity";
import { DeleteResult, UpdateResult } from "typeorm";

@Injectable()
export abstract class IProductsUseCase {
  abstract getProducts(
    pageOpts: PageOptions,
    category?: string
  ): Promise<Page<Products>>;

  abstract getProductById(id: string): Promise<Products>;

  abstract getProductByName(name: string): Promise<Products>;

  abstract createProduct(ProductModel: Products): Promise<Products>;

  abstract updateProduct(ProductModel: Products): Promise<UpdateResult>;

  abstract deleteProduct(id: string): Promise<DeleteResult>;

  abstract replenishStock(
    id: string,
    stock: number,
    cost: number
  ): Promise<any>;
}
