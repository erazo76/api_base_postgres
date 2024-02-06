import { Expose, plainToClass } from "class-transformer";
import { Purchases } from "infrastructure/database/mapper/Purchases.entity";
import { ApiProperty, PartialType } from "@nestjs/swagger";
import { PaginateQueryVM } from "../shared/paginateQuery.dto";

export class GetPurchaseVM extends PartialType(PaginateQueryVM) {
  @Expose()
  @ApiProperty({
    description: "Text to search",
    required: false,
    example: "Panes",
    type: String,
  })
  search?: string;

  @Expose()
  @ApiProperty({
    description: "Status of purchase",
    example: "REQUESTED | ROUTED | DELIVERED |CANCELED ",
    type: String,
  })
  status?: string;

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
    description: "Id of Buyer",
    example: "",
    type: String,
  })
  buyerId?: string;

  static toViewModel(module: Purchases): GetPurchaseVM {
    return plainToClass(GetPurchaseVM, module, {
      excludeExtraneousValues: true,
    });
  }

  static fromViewModel(mv: GetPurchaseVM): Purchases {
    return new Purchases({
      ...mv,
    });
  }
}
