import { ApiProperty } from "@nestjs/swagger";
import { Expose, plainToClass } from "class-transformer";
import {
  IsString,
  IsByteLength,
  IsOptional,
  IsBoolean,
  IsUUID,
} from "class-validator";
import { Categories } from "infrastructure/database/mapper/Categories.entity";

export class UpdateCategorieVM {
  @Expose()
  @IsOptional()
  @IsUUID()
  @ApiProperty({
    description: "Id of category",
    required: false,
    example: "d46f7074-5f44-44d2-8b79-92cb5d63bbc1",
    type: String,
  })
  id: string = null;

  @IsString()
  @IsByteLength(1, 100)
  @Expose()
  @ApiProperty({
    description: "Name of category",
    example: "admin",
    type: String,
  })
  name: string;

  @IsString()
  @IsByteLength(1, 500)
  @Expose()
  @ApiProperty({
    description: "Description of category",
    example: "admin",
    type: String,
  })
  description: string;

  @IsOptional()
  @Expose()
  @ApiProperty({
    description: "Image of category",
    example: "admin",
    type: String,
  })
  image: string;

  @IsOptional()
  @IsBoolean()
  @Expose()
  @ApiProperty({
    description: "Check if the category is active or inactive",
    default: "false",
    example: "true",
    type: Boolean,
  })
  active: boolean = false;

  static toViewModel(module: Categories): UpdateCategorieVM {
    return plainToClass(UpdateCategorieVM, module, {
      excludeExtraneousValues: true,
    });
  }

  static fromViewModel(
    currentCategorie: Categories,
    mv: UpdateCategorieVM
  ): Categories {
    currentCategorie.name = mv.name ?? currentCategorie.name;
    currentCategorie.description =
      mv.description ?? currentCategorie.description;
    currentCategorie.active = mv.active ?? currentCategorie.active;
    currentCategorie.image = mv.image ?? currentCategorie.image;
    return currentCategorie;
  }
}
