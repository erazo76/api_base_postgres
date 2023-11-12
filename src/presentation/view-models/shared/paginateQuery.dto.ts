import { Expose, Type } from "class-transformer";

import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, IsPositive } from "class-validator";

export class PaginateQueryVM {
  @Expose()
  @ApiProperty({
    description: "number pages",
    required: false,
    default: 1,
    example: 1,
  })
  @Type(() => Number)
  @IsOptional()
  @IsPositive()
  @IsInt()
  pag: number;

  @Expose()
  @ApiProperty({
    description: "register number to take",
    required: false,
    default: 10,
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  @IsInt()
  take: number = 10;
}
