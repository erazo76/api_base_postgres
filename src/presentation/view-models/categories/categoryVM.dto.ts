import { ApiProperty } from "@nestjs/swagger";
import { Expose, plainToClass } from "class-transformer";
import { Categories } from "infrastructure/database/mapper/Categories.entity";

export class CategorieVM {
  @Expose()
  @ApiProperty({
    description: "Id of category",
    example: "d46f7074-5f44-44d2-8b79-92cb5d63bbc0",
    required: false,
    type: String,
  })
  id: string;

  @Expose()
  @ApiProperty({
    description: "Name of category",
    example: "admin",
    type: String,
  })
  name: string;

  @Expose()
  @ApiProperty({
    description: "Description of category",
    example: "admin",
    type: String,
  })
  description: string;

  @Expose()
  @ApiProperty({
    description: "Image of category",
    example: "admin",
    type: String,
  })
  image: string;

  @Expose()
  @ApiProperty({
    description: "Check if the category is active or inactive",
    default: "false",
    example: "true",
    type: Boolean,
  })
  active: boolean = true;

  static toViewModel(module: Categories): CategorieVM {
    return plainToClass(CategorieVM, module, {
      excludeExtraneousValues: true,
    });
  }

  static fromViewModel(mv: CategorieVM): Categories {
    return plainToClass(Categories, mv, { excludeExtraneousValues: true });
  }
}
