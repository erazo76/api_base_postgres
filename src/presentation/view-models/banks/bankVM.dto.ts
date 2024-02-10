import { ApiProperty } from "@nestjs/swagger";
import { Expose, plainToClass } from "class-transformer";
import { Banks } from "infrastructure/database/mapper/Banks.entity";

export class BankVM {
  @Expose()
  @ApiProperty({
    description: "Id of bank",
    example: "d46f7074-5f44-44d2-8b79-92cb5d63bbc0",
    required: false,
    type: String,
  })
  id: string;

  @Expose()
  @ApiProperty({
    description: "Name of bank",
    example: "admin",
    type: String,
  })
  name: string;

  @Expose()
  @ApiProperty({
    description: "Bank account numbr",
    example: "73105548745689",
    type: String,
  })
  account: string;

  @Expose()
  @ApiProperty({
    description: "Url Image of bank",
    example: "https://imageklkjlkj...",
    type: String,
  })
  urlImage: string;

  @Expose()
  @ApiProperty({
    description: "Account type",
    example: "AHORRO | CORRIENTE",
    type: String,
  })
  type: string;

  @Expose()
  @ApiProperty({
    description: "Check if the bank is active or inactive",
    default: "false",
    example: "true",
    type: Boolean,
  })
  active: boolean;

  static toViewModel(module: Banks): BankVM {
    const bankVM = plainToClass(BankVM, module, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
    if (typeof module.active === "string") {
      bankVM.active = module.active === "true";
    }

    return bankVM;
  }

  static fromViewModel(mv: BankVM): Banks {
    return plainToClass(Banks, mv, { excludeExtraneousValues: true });
  }
}
