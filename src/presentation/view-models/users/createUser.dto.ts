import { Exclude, plainToClass } from "class-transformer";
import { Users } from "infrastructure/database/mapper/Users.entity";
import { UpdateUserVM } from "./updateUser.dto";

export class CreateUserVM extends UpdateUserVM {
  @Exclude()
  id: string = null;

  static toViewModel(module: Users): CreateUserVM {
    return plainToClass(CreateUserVM, module, {
      excludeExtraneousValues: true,
    });
  }

  static fromViewModel(mv: CreateUserVM): Users {
    delete mv.id;
    return new Users({
      ...mv,
    });
  }
}
