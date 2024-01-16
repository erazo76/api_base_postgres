import { plainToClass } from "class-transformer";
import { Purchases } from "infrastructure/database/mapper/Purchases.entity";
import { PartialType } from "@nestjs/swagger";
import { PaginateQueryVM } from "../shared/paginateQuery.dto";
import { Advertisements } from "infrastructure/database/mapper/Advertisements.entity";

export class GetAdvertisementVM extends PartialType(PaginateQueryVM) {
  static toViewModel(module: Advertisements): GetAdvertisementVM {
    return plainToClass(GetAdvertisementVM, module, {
      excludeExtraneousValues: true,
    });
  }

  static fromViewModel(mv: GetAdvertisementVM): Purchases {
    return new Purchases({
      ...mv,
    });
  }
}
