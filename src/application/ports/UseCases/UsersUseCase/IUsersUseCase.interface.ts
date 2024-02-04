import { Injectable } from "@nestjs/common";
import { Page, PageOptions } from "infrastructure/common/page";
import { Users } from "infrastructure/database/mapper/Users.entity";
import { DeleteResult, UpdateResult } from "typeorm";

@Injectable()
export abstract class IUsersUseCase {
  abstract getUsers(): Promise<Users[]>;

  abstract getUserById(id: string): Promise<Users>;

  abstract getUserByUserNameOrEmail(userName: string): Promise<Users>;

  abstract getUsersPag(pageOpts: PageOptions): Promise<Page<Users>>;

  abstract createUser(
    UserModel: Users,
    protocol: string,
    host: string
  ): Promise<Users>;

  abstract updateUser(UserModel: Users): Promise<UpdateResult>;

  abstract deleteUser(id: string): Promise<DeleteResult>;

  abstract countUser(): Promise<number>;

  abstract validateRegister(id: string): Promise<void>;

  abstract initResetDate(): Promise<void>;

  abstract getDataUserByEmail(email: string): Promise<void>;

  abstract addPoint(userId: string, point: number): Promise<number>;
}
