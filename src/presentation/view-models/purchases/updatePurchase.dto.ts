import { ApiProperty } from "@nestjs/swagger";
import { Expose, plainToClass } from "class-transformer";
import {
  IsOptional,
  IsBoolean,
  IsUUID,
  IsNumber,
  Min,
  Max,
  IsString,
  Matches,
} from "class-validator";
import { Purchases } from "infrastructure/database/mapper/Purchases.entity";

export class UpdatePurchaseVM {
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
    description: "Total purchase",
    example: "12.5",
    type: Number,
  })
  total: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.0)
  @Max(9999999999.99)
  @Expose()
  @ApiProperty({
    description: "Cash to payment purchase",
    example: "12.5",
    type: Number,
  })
  paymentCash: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.0)
  @Max(9999999999.99)
  @Expose()
  @ApiProperty({
    description: "Change to payment purchase",
    example: "12.5",
    type: Number,
  })
  paymentChange: number;

  @IsOptional()
  @Expose()
  @ApiProperty({
    description: "Url to Image of payment transfer capture",
    example: "admin",
    type: String,
  })
  paymentImage: string;

  @IsString()
  @Matches(/^(REQUESTED|ROUTED|DELIVERED|CANCELED)$/, {
    message: "Status must be REQUESTED, ROUTED, DELIVERED or CANCELED",
  })
  @Expose()
  @ApiProperty({
    description: "Status of purchase",
    example: "REQUESTED | ROUTED | DELIVERED |CANCELED ",
    type: String,
  })
  status: string;

  @IsString()
  @Matches(/^(EFECTIVO|TRANSFERENCIA)$/, {
    message: "Status must be EFECTIVO or TRANSFERENCIA",
  })
  @Expose()
  @ApiProperty({
    description: "Type of payment",
    example: "EFECTIVO | TRANSFERENCIA",
    type: String,
  })
  paymentType: string;

  @IsOptional()
  @IsBoolean()
  @Expose()
  @ApiProperty({
    description: "Check if the product is active or inactive",
    default: "false",
    example: "true",
    type: Boolean,
  })
  active: boolean = false;

  @IsOptional()
  @IsBoolean()
  @Expose()
  @ApiProperty({
    description: "Check if the purchase have paymented",
    default: "false",
    example: "true",
    type: Boolean,
  })
  paymented: boolean = false;

  @IsOptional()
  @Expose()
  @IsUUID()
  @ApiProperty({
    description: "Id of userBuyer",
    required: false,
    example: "d46f7074-5f44-44d2-8b79-92cb5d63bbc1",
    type: String,
  })
  buyer: string;

  static toViewModel(module: Purchases): UpdatePurchaseVM {
    return plainToClass(UpdatePurchaseVM, module, {
      excludeExtraneousValues: true,
    });
  }

  static fromViewModel(
    currentPurchase: Purchases,
    mv: UpdatePurchaseVM
  ): Purchases {
    currentPurchase.total = mv.total ?? currentPurchase.total;
    currentPurchase.status = mv.status ?? currentPurchase.status;
    currentPurchase.active = mv.active ?? currentPurchase.active;

    currentPurchase.paymented = mv.paymented ?? currentPurchase.paymented;
    currentPurchase.paymentImage =
      mv.paymentImage ?? currentPurchase.paymentImage;
    currentPurchase.paymentChange =
      mv.paymentChange ?? currentPurchase.paymentChange;
    currentPurchase.paymentCash = mv.paymentCash ?? currentPurchase.paymentCash;
    return currentPurchase;
  }
}
