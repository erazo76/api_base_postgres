import { ApiProperty } from "@nestjs/swagger";
import { Expose, plainToClass } from "class-transformer";
import {
  IsString,
  IsByteLength,
  IsOptional,
  IsBoolean,
  IsUUID,
  Matches,
} from "class-validator";
import { Users } from "infrastructure/database/mapper/Users.entity";

export class UpdateUserVM {
  @Expose()
  @IsOptional()
  @IsUUID()
  @ApiProperty({
    description: "Id of user",
    required: false,
    example: "d46f7074-5f44-44d2-8b79-92cb5d63bbc1",
    type: String,
  })
  id: string = null;

  @IsString()
  @IsByteLength(1, 100)
  @Expose()
  @ApiProperty({
    description: "Name of user",
    example: "admin",
    type: String,
  })
  name: string;

  @IsString()
  @IsByteLength(1, 100)
  @Expose()
  @ApiProperty({
    description: "UserName of user",
    example: "admin",
    type: String,
  })
  userName: string;

  @IsString()
  @IsByteLength(1, 100)
  @Expose()
  @ApiProperty({
    description: "Email of user",
    example: "admin",
    type: String,
  })
  email: string;

  @IsString()
  @IsByteLength(1, 100)
  @Expose()
  @ApiProperty({
    description: "Phone of user",
    example: "admin",
    type: String,
  })
  phone: string;

  @IsString()
  @IsByteLength(1, 100)
  @Expose()
  @ApiProperty({
    description: "Address of user",
    example: "admin",
    type: String,
  })
  address: string;

  @IsOptional()
  @IsString()
  @Matches(/^(ADMIN|SELLER|CLIENT)$/, {
    message: "Role must be ADMIN, SELLER or CLIENT",
  })
  @Expose()
  @ApiProperty({
    description: "Rol of user",
    example: "ADMIN | SELLER | CLIENT",
    type: String,
  })
  role: string;

  @IsOptional()
  @IsBoolean()
  @Expose()
  @ApiProperty({
    description: "Check if the user is active or inactive",
    default: "false",
    example: "true",
    type: Boolean,
  })
  active: boolean = true;

  static toViewModel(module: Users): UpdateUserVM {
    return plainToClass(UpdateUserVM, module, {
      excludeExtraneousValues: true,
    });
  }

  static fromViewModel(currentUser: Users, mv: UpdateUserVM): Users {
    currentUser.name = mv.name ?? currentUser.name;
    currentUser.userName = mv.userName ?? currentUser.userName;
    currentUser.email = mv.email ?? currentUser.email;
    currentUser.active = mv.active ?? currentUser.active;
    currentUser.role = mv.role ?? currentUser.role;
    currentUser.address = mv.address ?? currentUser.address;
    currentUser.phone = mv.phone ?? currentUser.phone;
    return currentUser;
  }
}
