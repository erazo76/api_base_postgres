import { ApiProperty } from "@nestjs/swagger";
import { Expose, plainToClass } from "class-transformer";
import { IsOptional, IsUUID, IsNumber, Min, Max } from "class-validator";
import { PurchaseDetails } from "infrastructure/database/mapper/PurchaseDetails.entity";

export class UpdatePurchaseDetailVM {
  @Expose()
  @IsOptional()
  @IsUUID()
  @ApiProperty({
    description: "Id of product",
    required: false,
    example: "d46f7074-5f44-44d2-8b79-92cb5d63bbc1",
    type: String,
  })
  id: string = null;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.0)
  @Max(9999999999.99)
  @Expose()
  @ApiProperty({
    description: "Subtotal purchase",
    example: "12.5",
    type: Number,
  })
  subtotal: number;

  @IsNumber()
  @Min(0)
  @Max(99999999)
  @Expose()
  @ApiProperty({
    description: "Quantity of products",
    example: "12.5",
    type: Number,
  })
  quantity: number;

  @IsOptional()
  @Expose()
  @IsUUID()
  @ApiProperty({
    description: "Id of userSeller",
    required: false,
    example: "d46f7074-5f44-44d2-8b79-92cb5d63bbc1",
    type: String,
  })
  seller: string;

  @IsOptional()
  @Expose()
  @IsUUID()
  @ApiProperty({
    description: "Id of product",
    required: false,
    example: "d46f7074-5f44-44d2-8b79-92cb5d63bbc1",
    type: String,
  })
  product: string;

  @IsOptional()
  @Expose()
  @IsUUID()
  @ApiProperty({
    description: "Detail of product",
    required: false,
    example: "d46f7074-5f44-44d2-8b79-92cb5d63bbc1",
    type: String,
  })
  detail: string;

  static toViewModel(module: PurchaseDetails): UpdatePurchaseDetailVM {
    return plainToClass(UpdatePurchaseDetailVM, module, {
      excludeExtraneousValues: true,
    });
  }

  static fromViewModel(
    currentPurchaseDetail: PurchaseDetails,
    mv: UpdatePurchaseDetailVM
  ): PurchaseDetails {
    currentPurchaseDetail.quantity =
      mv.quantity ?? currentPurchaseDetail.quantity;
    currentPurchaseDetail.subtotal =
      mv.subtotal ?? currentPurchaseDetail.subtotal;
    return currentPurchaseDetail;
  }
}
