import { ApiProperty } from "@nestjs/swagger";
import { Expose, plainToClass } from "class-transformer";
import { Users } from "infrastructure/database/mapper/Users.entity";

export class UserVM {
  @Expose()
  @ApiProperty({
    description: "Id of user",
    example: "d46f7074-5f44-44d2-8b79-92cb5d63bbc0",
    required: false,
    type: String,
  })
  id: string;

  @Expose()
  @ApiProperty({
    description: "Name of user",
    example: "admin",
    type: String,
  })
  name: string;

  @Expose()
  @ApiProperty({
    description: "UserName of user",
    example: "admin",
    type: String,
  })
  userName: string;

  @Expose()
  @ApiProperty({
    description: "Email of user",
    example: "admin",
    type: String,
  })
  email: string;

  @Expose()
  @ApiProperty({
    description: "Phone of user",
    example: "admin",
    type: String,
  })
  phone: string;

  @Expose()
  @ApiProperty({
    description: "Address of user",
    example: "admin",
    type: String,
  })
  address: string;

  /*@Expose()
  @ApiProperty({
    description: "Password of user",
    example: "admin",
    type: String,
  })
  password: string;*/

  @Expose()
  @ApiProperty({
    description: "Rol of user",
    example: "ADMIN | SELLER | CLIENT",
    type: String,
  })
  role: string;

  @Expose()
  @ApiProperty({
    description: "Check if the user is active or inactive",
    default: "false",
    example: "true",
    type: Boolean,
  })
  active: boolean = true;

  @Expose()
  @ApiProperty({
    description: "Last latitude of user",
    example: "-74.4561235",
    type: String,
  })
  latitude: string;

  @Expose()
  @ApiProperty({
    description: "Last longitude of user",
    example: "10.4565465",
    type: String,
  })
  longitude: string;

  static toViewModel(module: Users): UserVM {
    return plainToClass(UserVM, module, {
      excludeExtraneousValues: true,
    });
  }

  static fromViewModel(mv: UserVM): Users {
    return plainToClass(Users, mv, { excludeExtraneousValues: true });
  }
}
