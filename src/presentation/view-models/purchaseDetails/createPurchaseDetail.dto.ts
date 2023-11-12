import { Exclude, plainToClass } from "class-transformer";
import { PurchaseDetails } from "infrastructure/database/mapper/PurchaseDetails.entity";
import { UpdatePurchaseDetailVM } from "./updatePurchaseDetail.dto";
import { PartialType } from "@nestjs/swagger";

export class CreatePurchaseDetailVM extends PartialType(
  UpdatePurchaseDetailVM
) {
  @Exclude()
  id: string = null;

  static toViewModel(module: PurchaseDetails): CreatePurchaseDetailVM {
    return plainToClass(CreatePurchaseDetailVM, module, {
      excludeExtraneousValues: true,
    });
  }

  static fromViewModel(mv: CreatePurchaseDetailVM): PurchaseDetails {
    delete mv.id;
    return new PurchaseDetails({
      ...mv,
    });
  }
}
