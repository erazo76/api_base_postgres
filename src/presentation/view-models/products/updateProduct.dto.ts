import { ApiProperty } from "@nestjs/swagger";
import { Expose, plainToClass } from "class-transformer";
import {
  IsString,
  IsByteLength,
  IsOptional,
  IsBoolean,
  IsUUID,
  IsNumber,
  Min,
  Max,
} from "class-validator";
import { Products } from "infrastructure/database/mapper/Products.entity";

export class UpdateProductVM {
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

  @IsString()
  @IsByteLength(1, 100)
  @Expose()
  @ApiProperty({
    description: "Name of product",
    example: "admin",
    type: String,
  })
  name: string;

  @IsString()
  @IsByteLength(1, 500)
  @Expose()
  @ApiProperty({
    description: "Description of product",
    example: "admin",
    type: String,
  })
  description: string;

  @IsOptional()
  @Expose()
  @ApiProperty({
    description: "Image of product",
    example: "admin",
    type: String,
  })
  image: string;

  @IsString()
  @IsByteLength(1, 100)
  @Expose()
  @ApiProperty({
    description: "Brand of product",
    example: "Nestle",
    type: String,
  })
  brand: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.0)
  @Max(9999999999.99)
  @Expose()
  @ApiProperty({
    description: "Price of product",
    example: "12.5",
    type: Number,
  })
  price: number;

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

  @Expose()
  @IsUUID()
  @ApiProperty({
    description: "Id of category",
    required: false,
    example: "d46f7074-5f44-44d2-8b79-92cb5d63bbc1",
    type: String,
  })
  category: string;

  static toViewModel(module: Products): UpdateProductVM {
    return plainToClass(UpdateProductVM, module, {
      excludeExtraneousValues: true,
    });
  }

  static fromViewModel(
    currentProduct: Products,
    mv: UpdateProductVM
  ): Products {
    currentProduct.name = mv.name ?? currentProduct.name;
    currentProduct.description = mv.description ?? currentProduct.description;
    currentProduct.price = mv.price ?? currentProduct.price;
    currentProduct.stock = mv.stock ?? currentProduct.stock;
    currentProduct.image = mv.image ?? currentProduct.image;
    currentProduct.brand = mv.brand ?? currentProduct.brand;
    currentProduct.active = mv.active ?? currentProduct.active;
    return currentProduct;
  }
}
