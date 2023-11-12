import { Injectable } from "@nestjs/common";
import { ICategoriesRepository } from "application/ports/Repository/CategoriesRepository/ICategoriesRepository.interface";
import { ICategoriesUseCase } from "application/ports/UseCases/CategoriesUseCase/ICategoriesUseCase.interface";
import { Page, PageMeta, PageOptions } from "infrastructure/common/page";
import { Categories } from "infrastructure/database/mapper/Categories.entity";

import { DeleteResult, UpdateResult } from "typeorm";

@Injectable()
export class CategoriesUseCase implements ICategoriesUseCase {
  constructor(private readonly categoriesRepo: ICategoriesRepository) {}

  async getCategories(pageOpts: PageOptions): Promise<Page<Categories>> {
    const [categories, count] = await this.categoriesRepo.findAndCount({
      skip: pageOpts.page - 1,
      take: pageOpts.take,
    });
    const pageMeta = new PageMeta(pageOpts, count);
    return new Page(categories, pageMeta);
  }

  getCategorieById(id: string): Promise<Categories> {
    return this.categoriesRepo.findOne(id);
  }

  getCategorieByName(name: string): Promise<Categories> {
    return this.categoriesRepo.findOne({ where: [{ name: name }] });
  }

  createCategorie(moduleModel: Categories): Promise<Categories> {
    console.log(moduleModel);
    return this.categoriesRepo.save(moduleModel);
  }

  updateCategorie(moduleModel: Categories): Promise<UpdateResult> {
    return this.categoriesRepo.update(moduleModel.id, moduleModel);
  }

  deleteCategorie(id: string): Promise<DeleteResult> {
    return this.categoriesRepo.delete(id);
  }
}
