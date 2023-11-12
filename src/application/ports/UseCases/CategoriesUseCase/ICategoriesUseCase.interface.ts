import { Injectable } from "@nestjs/common";
import { Page, PageOptions } from "infrastructure/common/page";
import { Categories } from "infrastructure/database/mapper/Categories.entity";
import { DeleteResult, UpdateResult } from "typeorm";

@Injectable()
export abstract class ICategoriesUseCase {
  abstract getCategories(pageOpts: PageOptions): Promise<Page<Categories>>;

  abstract getCategorieById(id: string): Promise<Categories>;

  abstract getCategorieByName(name: string): Promise<Categories>;

  abstract createCategorie(CategorieModel: Categories): Promise<Categories>;

  abstract updateCategorie(CategorieModel: Categories): Promise<UpdateResult>;

  abstract deleteCategorie(id: string): Promise<DeleteResult>;
}
