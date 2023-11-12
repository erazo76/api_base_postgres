import { Exclude, plainToClass } from "class-transformer";
import { Categories } from "infrastructure/database/mapper/Categories.entity";
import { UpdateCategorieVM } from "./updateCategory.dto";

export class CreateCategorieVM extends UpdateCategorieVM {
  @Exclude()
  id: string = null;

  static toViewModel(module: Categories): CreateCategorieVM {
    return plainToClass(CreateCategorieVM, module, {
      excludeExtraneousValues: true,
    });
  }

  static fromViewModel(mv: CreateCategorieVM): Categories {
    delete mv.id;
    return new Categories({
      ...mv,
    });
  }
}
