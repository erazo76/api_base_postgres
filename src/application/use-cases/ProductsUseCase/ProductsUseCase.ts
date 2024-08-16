import { Injectable } from "@nestjs/common";
import { IProductsRepository } from "application/ports/Repository/ProductsRepository/IProductsRepository.interface";
import { IProductsUseCase } from "application/ports/UseCases/ProductsUseCase/IProductsUseCase.interface";
import { Page, PageMeta, PageOptions } from "infrastructure/common/page";
import { Products } from "infrastructure/database/mapper/Products.entity";
import { UpdateResult } from "typeorm";

@Injectable()
export class ProductsUseCase implements IProductsUseCase {
  constructor(private readonly categoriesRepo: IProductsRepository) {}

  async getProducts(pageOpts: PageOptions): Promise<Page<Products>> {
    try {
      const [categories, count] = await this.categoriesRepo.findAndCount({
        skip: (pageOpts.page - 1) * pageOpts.take,
        take: pageOpts.take,
        relations: ["category"],
      });
      const pageMeta = new PageMeta(pageOpts, count);
      return new Page(categories, pageMeta);
    } catch (error) {
      console.log(error);
    }
  }

  getProductById(id: string): Promise<Products> {
    return this.categoriesRepo.findOne({
      where: { id },
      relations: ["category"],
    });
  }

  getProductByName(name: string): Promise<Products> {
    return this.categoriesRepo.findOne({ where: [{ name: name }] });
  }

  createProduct(moduleModel: Products): Promise<Products> {
    return this.categoriesRepo.save(moduleModel);
  }

  updateProduct(moduleModel: Products): Promise<UpdateResult> {
    return this.categoriesRepo.update(moduleModel.id, moduleModel);
  }

  async deleteProduct(id: string): Promise<Products> {
    const product = await this.categoriesRepo.findOne(id);
    product.active = false;
    this.categoriesRepo.update(product.id, product);
    return product;
  }

  async replenishStock(id: string, stock: number, cost: number): Promise<any> {
    try {
      let model = await this.getProductById(id);
      model.id = id;
      model.stock += stock;
      model.cost = cost;
      return await this.updateProduct(model);
    } catch (error) {
      console.log(error);
    }
  }
}
