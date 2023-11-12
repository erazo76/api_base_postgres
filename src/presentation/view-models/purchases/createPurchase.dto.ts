import { Exclude, plainToClass } from "class-transformer";
import { Purchases } from "infrastructure/database/mapper/Purchases.entity";
import { UpdatePurchaseVM } from "./updatePurchase.dto";
import { PartialType } from "@nestjs/swagger";

export class CreatePurchaseVM extends PartialType(UpdatePurchaseVM) {
  @Exclude()
  id: string = null;

  static toViewModel(module: Purchases): CreatePurchaseVM {
    return plainToClass(CreatePurchaseVM, module, {
      excludeExtraneousValues: true,
    });
  }

  static fromViewModel(mv: CreatePurchaseVM): Purchases {
    delete mv.id;
    return new Purchases({
      ...mv,
    });
  }
}
