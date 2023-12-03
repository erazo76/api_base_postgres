import { Expose, plainToClass } from "class-transformer";
import { Purchases } from "infrastructure/database/mapper/Purchases.entity";
import { ApiProperty, PartialType } from "@nestjs/swagger";
import { PaginateQueryVM } from "../shared/paginateQuery.dto";
import { Products } from "infrastructure/database/mapper/Products.entity";

export class GetProductVM extends PartialType(PaginateQueryVM) {
  @Expose()
  @ApiProperty({
    description: "Category of products",
    example: "Panadería",
    type: String,
  })
  category?: string;

  static toViewModel(module: Products): GetProductVM {
    return plainToClass(GetProductVM, module, {
      excludeExtraneousValues: true,
    });
  }

  static fromViewModel(mv: GetProductVM): Purchases {
    return new Purchases({
      ...mv,
    });
  }
}
