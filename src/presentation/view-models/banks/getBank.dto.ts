import { plainToClass } from "class-transformer";
import { Purchases } from "infrastructure/database/mapper/Purchases.entity";
import { PartialType } from "@nestjs/swagger";
import { PaginateQueryVM } from "../shared/paginateQuery.dto";
import { Banks } from "infrastructure/database/mapper/Banks.entity";

export class GetBankVM extends PartialType(PaginateQueryVM) {
  static toViewModel(module: Banks): GetBankVM {
    return plainToClass(GetBankVM, module, {
      excludeExtraneousValues: true,
    });
  }

  static fromViewModel(mv: GetBankVM): Purchases {
    return new Purchases({
      ...mv,
    });
  }
}
