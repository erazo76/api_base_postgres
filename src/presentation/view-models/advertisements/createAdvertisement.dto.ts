import { Exclude, plainToClass } from "class-transformer";
import { Advertisements } from "infrastructure/database/mapper/Advertisements.entity";
import { UpdateAdvertisementVM } from "./updateAdvertisement.dto";
import { PartialType } from "@nestjs/swagger";

export class CreateAdvertisementVM extends PartialType(UpdateAdvertisementVM) {
  @Exclude()
  id: string = null;

  static toViewModel(module: Advertisements): CreateAdvertisementVM {
    return plainToClass(CreateAdvertisementVM, module, {
      excludeExtraneousValues: true,
    });
  }

  static fromViewModel(mv: CreateAdvertisementVM): Advertisements {
    delete mv.id;
    return new Advertisements({
      ...mv,
    });
  }
}
