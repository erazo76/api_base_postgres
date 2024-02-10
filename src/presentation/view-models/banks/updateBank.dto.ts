import { ApiProperty } from "@nestjs/swagger";
import { Expose, plainToClass } from "class-transformer";
import { IsString, IsByteLength, IsOptional, IsUUID } from "class-validator";
import { Banks } from "infrastructure/database/mapper/Banks.entity";

export class UpdateBankVM {
  @Expose()
  @IsOptional()
  @IsUUID()
  @ApiProperty({
    description: "Id of bank",
    required: false,
    example: "d46f7074-5f44-44d2-8b79-92cb5d63bbc1",
    type: String,
  })
  id: string = null;

  @IsString()
  @IsByteLength(1, 100)
  @Expose()
  @ApiProperty({
    description: "Name of bank",
    example: "admin",
    type: String,
  })
  name: string;

  @IsString()
  @IsByteLength(1, 100)
  @Expose()
  @ApiProperty({
    description: "Bank account numbr",
    example: "73105548745689",
    type: String,
  })
  account: string;

  @IsOptional()
  @Expose()
  @ApiProperty({
    description: "Url Image of bank",
    example: "https://imageklkjlkj...",
    type: String,
  })
  urlImage: string;

  @IsOptional()
  @Expose()
  @ApiProperty({
    description: "Account type",
    example: "AHORRO | CORRIENTE",
    type: String,
  })
  type: string;

  @IsOptional()
  @Expose()
  @ApiProperty({
    description: "Check if the bank is active or inactive",
    default: "false",
    example: "true",
    type: Boolean,
  })
  active: boolean = false;

  static toViewModel(module: Banks): UpdateBankVM {
    return plainToClass(UpdateBankVM, module, {
      excludeExtraneousValues: true,
    });
  }

  static fromViewModel(currentBank: Banks, mv: UpdateBankVM): Banks {
    currentBank.name = mv.name ?? currentBank.name;
    currentBank.type = mv.type ?? currentBank.type;
    currentBank.account = mv.account ?? currentBank.account;
    currentBank.urlImage = mv.urlImage ?? currentBank.urlImage;

    if (typeof mv.active === "string") {
      currentBank.active = mv.active === "true";
    } else {
      currentBank.active = mv.active ?? currentBank.active;
    }

    return currentBank;
  }
}
