import { Exclude, plainToClass } from "class-transformer";
import { Products } from "infrastructure/database/mapper/Products.entity";
import { UpdateProductVM } from "./updateProduct.dto";
import { PartialType } from "@nestjs/swagger";

export class CreateProductVM extends PartialType(UpdateProductVM) {
  @Exclude()
  id: string = null;

  static toViewModel(module: Products): CreateProductVM {
    return plainToClass(CreateProductVM, module, {
      excludeExtraneousValues: true,
    });
  }

  static fromViewModel(mv: CreateProductVM): Products {
    delete mv.id;
    return new Products({
      ...mv,
    });
  }
}
