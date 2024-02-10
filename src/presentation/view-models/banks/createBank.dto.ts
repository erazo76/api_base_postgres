import { Exclude, plainToClass } from "class-transformer";
import { Banks } from "infrastructure/database/mapper/Banks.entity";
import { UpdateBankVM } from "./updateBank.dto";
import { PartialType } from "@nestjs/swagger";

export class CreateBankVM extends PartialType(UpdateBankVM) {
  @Exclude()
  id: string = null;

  static toViewModel(module: Banks): CreateBankVM {
    return plainToClass(CreateBankVM, module, {
      excludeExtraneousValues: true,
    });
  }

  static fromViewModel(mv: CreateBankVM): Banks {
    delete mv.id;
    return new Banks({
      ...mv,
    });
  }
}
