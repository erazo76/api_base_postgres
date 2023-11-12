import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type, plainToClass } from "class-transformer";
import { Products } from "infrastructure/database/mapper/Products.entity";

export class ProductVM {
  @Expose()
  @ApiProperty({
    description: "Id of product",
    example: "d46f7074-5f44-44d2-8b79-92cb5d63bbc0",
    required: false,
    type: String,
  })
  id: string;

  @Expose()
  @ApiProperty({
    description: "Name of product",
    example: "admin",
    type: String,
  })
  name: string;

  @Expose()
  @ApiProperty({
    description: "Description of product",
    example: "admin",
    type: String,
  })
  description: string;

  @Expose()
  @ApiProperty({
    description: "Image of product",
    example: "admin",
    type: String,
  })
  image: string;

  @Expose()
  @ApiProperty({
    description: "Brand of product",
    example: "Nestle",
    type: String,
  })
  brand: string;

  @Expose()
  @ApiProperty({
    description: "Price of product",
    example: "12.5",
    type: Number,
  })
  price: number;

  @Expose()
  @ApiProperty({
    description: "Stock of product",
    example: "100",
    type: Number,
  })
  stock: number;

  @Expose()
  @ApiProperty({
    description: "Check if the product is active or inactive",
    default: "false",
    example: "true",
    type: Boolean,
  })
  active: boolean = true;

  @Expose()
  @Type(() => ProductVM)
  @ApiProperty({
    description: "Id of category",
    required: false,
    example: "d46f7074-5f44-44d2-8b79-92cb5d63bbc1",
    type: String,
  })
  category: ProductVM;

  static toViewModel(module: Products): ProductVM {
    return plainToClass(ProductVM, module, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  static fromViewModel(mv: ProductVM): Products {
    return plainToClass(Products, mv, { excludeExtraneousValues: true });
  }
}
