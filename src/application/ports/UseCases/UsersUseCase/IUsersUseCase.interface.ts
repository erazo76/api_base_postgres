import { Injectable } from "@nestjs/common";
import { Users } from "infrastructure/database/mapper/Users.entity";
import { DeleteResult, UpdateResult } from "typeorm";

@Injectable()
export abstract class IUsersUseCase {
  abstract getUsers(): Promise<Users[]>;

  abstract getUserById(id: string): Promise<Users>;

  abstract getUserByUserNameOrEmail(userName: string): Promise<Users>;

  abstract getUsersPag(take: number, pag: number): Promise<[Users[], number]>;

  abstract createUser(UserModel: Users): Promise<Users>;

  abstract updateUser(UserModel: Users): Promise<UpdateResult>;

  abstract deleteUser(id: string): Promise<DeleteResult>;
}
