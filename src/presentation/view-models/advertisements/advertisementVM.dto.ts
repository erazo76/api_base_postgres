import { ApiProperty } from "@nestjs/swagger";
import { Expose, plainToClass } from "class-transformer";
import { Advertisements } from "infrastructure/database/mapper/Advertisements.entity";

export class AdvertisementVM {
  @Expose()
  @ApiProperty({
    description: "Id of advertisement",
    example: "d46f7074-5f44-44d2-8b79-92cb5d63bbc0",
    required: false,
    type: String,
  })
  id: string;

  @Expose()
  @ApiProperty({
    description: "Name of advertisement",
    example: "admin",
    type: String,
  })
  title: string;

  @Expose()
  @ApiProperty({
    description: "Description of advertisement",
    example: "admin",
    type: String,
  })
  description: string;

  @Expose()
  @ApiProperty({
    description: "Url Image of advertisement",
    example: "admin",
    type: String,
  })
  urlImage: string;

  @Expose()
  @ApiProperty({
    description: "WhatsApo asociate to advertisement",
    example: "+573105548789",
    type: String,
  })
  whatsapp: string;

  @Expose()
  @ApiProperty({
    description: "Check if the advertisement is active or inactive",
    default: "false",
    example: "true",
    type: Boolean,
  })
  active: boolean;

  static toViewModel(module: Advertisements): AdvertisementVM {
    const advertisementVM = plainToClass(AdvertisementVM, module, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
    if (typeof module.active === "string") {
      advertisementVM.active = module.active === "true";
    }

    return advertisementVM;
  }

  static fromViewModel(mv: AdvertisementVM): Advertisements {
    return plainToClass(Advertisements, mv, { excludeExtraneousValues: true });
  }
}
