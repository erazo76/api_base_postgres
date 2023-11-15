import { ApiProperty } from "@nestjs/swagger";
import { Expose, plainToClass } from "class-transformer";
import { IsNumber, Min, Max } from "class-validator";
import { Products } from "infrastructure/database/mapper/Products.entity";

export class ReplenishStockVM {
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.0)
  @Max(9999999999.99)
  @Expose()
  @ApiProperty({
    description: "Cost of product",
    example: "12.5",
    type: Number,
  })
  cost: number;

  @IsNumber()
  @Min(0)
  @Max(9999999)
  @Expose()
  @ApiProperty({
    description: "Stock of product",
    example: "100",
    type: Number,
  })
  stock: number;

  static toViewModel(module: Products): ReplenishStockVM {
    return plainToClass(ReplenishStockVM, module, {
      excludeExtraneousValues: true,
    });
  }

  static fromViewModel(mv: ReplenishStockVM): Products {
    return new Products({
      ...mv,
    });
  }
}
