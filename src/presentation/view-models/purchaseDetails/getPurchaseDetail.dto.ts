import { Expose, plainToClass } from "class-transformer";
import { Purchases } from "infrastructure/database/mapper/Purchases.entity";
import { ApiProperty, PartialType } from "@nestjs/swagger";
import { PaginateQueryVM } from "../shared/paginateQuery.dto";

export class GetPurchaseDetailVM extends PartialType(PaginateQueryVM) {
  @Expose()
  @ApiProperty({
    description: "Status of purchase",
    example: "true | false",
    type: Boolean,
  })
  active?: boolean;

  @Expose()
  @ApiProperty({
    description: "Status of purchase",
    example: "",
    type: String,
  })
  startDate?: string;

  @Expose()
  @ApiProperty({
    description: "Status of purchase",
    example: "",
    type: String,
  })
  endDate?: string;

  @Expose()
  @ApiProperty({
    description: "Text to search",
    required: false,
    example: "Panes",
    type: String,
  })
  search?: string;

  static toViewModel(module: Purchases): GetPurchaseDetailVM {
    return plainToClass(GetPurchaseDetailVM, module, {
      excludeExtraneousValues: true,
    });
  }

  static fromViewModel(mv: GetPurchaseDetailVM): Purchases {
    return new Purchases({
      ...mv,
    });
  }
}
