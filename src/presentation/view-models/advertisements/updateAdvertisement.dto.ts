import { ApiProperty } from "@nestjs/swagger";
import { Expose, plainToClass } from "class-transformer";
import { IsString, IsByteLength, IsOptional, IsUUID } from "class-validator";
import { Advertisements } from "infrastructure/database/mapper/Advertisements.entity";

export class UpdateAdvertisementVM {
  @Expose()
  @IsOptional()
  @IsUUID()
  @ApiProperty({
    description: "Id of advertisement",
    required: false,
    example: "d46f7074-5f44-44d2-8b79-92cb5d63bbc1",
    type: String,
  })
  id: string = null;

  @IsString()
  @IsByteLength(1, 100)
  @Expose()
  @ApiProperty({
    description: "Title of advertisement",
    example: "admin",
    type: String,
  })
  title: string;

  @IsString()
  @IsByteLength(1, 500)
  @Expose()
  @ApiProperty({
    description: "Description of advertisement",
    example: "admin",
    type: String,
  })
  description: string;

  @IsString()
  @IsByteLength(1, 100)
  @Expose()
  @ApiProperty({
    description: "WhatsApo asociate to advertisement",
    example: "+573105548789",
    type: String,
  })
  whatsapp: string;

  @IsOptional()
  @Expose()
  @ApiProperty({
    description: "Url Image of advertisement",
    example: "https://imageklkjlkj...",
    type: String,
  })
  urlImage: string;

  @IsOptional()
  @Expose()
  @ApiProperty({
    description: "Aditional url link of advertisement",
    example: "https://imageklkjlkj...",
    type: String,
  })
  link: string;

  @IsOptional()
  @Expose()
  @ApiProperty({
    description: "Check if the advertisement is active or inactive",
    default: "false",
    example: "true",
    type: Boolean,
  })
  active: boolean = false;

  static toViewModel(module: Advertisements): UpdateAdvertisementVM {
    return plainToClass(UpdateAdvertisementVM, module, {
      excludeExtraneousValues: true,
    });
  }

  static fromViewModel(
    currentAdvertisement: Advertisements,
    mv: UpdateAdvertisementVM
  ): Advertisements {
    currentAdvertisement.title = mv.title ?? currentAdvertisement.title;
    currentAdvertisement.description =
      mv.description ?? currentAdvertisement.description;
    currentAdvertisement.whatsapp =
      mv.whatsapp ?? currentAdvertisement.whatsapp;
    currentAdvertisement.urlImage =
      mv.urlImage ?? currentAdvertisement.urlImage;
    currentAdvertisement.link = mv.link ?? currentAdvertisement.link;

    if (typeof mv.active === "string") {
      currentAdvertisement.active = mv.active === "true";
    } else {
      currentAdvertisement.active = mv.active ?? currentAdvertisement.active;
    }

    return currentAdvertisement;
  }
}
