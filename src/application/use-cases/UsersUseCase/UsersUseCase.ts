import { Injectable } from "@nestjs/common";
import { IUsersRepository } from "application/ports/Repository/UsersRepository/IUsersRepository.interface";
import { IUsersUseCase } from "application/ports/UseCases/UsersUseCase/IUsersUseCase.interface";
import { Users } from "infrastructure/database/mapper/Users.entity";

import { DeleteResult, UpdateResult } from "typeorm";

@Injectable()
export class UsersUseCase implements IUsersUseCase {
  constructor(private readonly usersRepo: IUsersRepository) {}

  getUsers(): Promise<Users[]> {
    return this.usersRepo.find();
  }

  getUserById(id: string): Promise<Users> {
    return this.usersRepo.findOne(id);
  }

  getUserByUserNameOrEmail(username: string): Promise<Users> {
    return this.usersRepo.findOne({
      where: [{ userName: username }, { email: username }],
    });
  }

  getUsersPag(take: number, skip: number): Promise<[Users[], number]> {
    return this.usersRepo.findAndCount({
      take,
      skip,
    });
  }

  async createUser(moduleModel: Users): Promise<Users> {
    console.log(moduleModel);
    try {
      return await this.usersRepo.save(moduleModel);
    } catch (error) {
      console.log(error);
    }
  }

  updateUser(moduleModel: Users): Promise<UpdateResult> {
    return this.usersRepo.update(moduleModel.id, moduleModel);
  }

  deleteUser(id: string): Promise<DeleteResult> {
    return this.usersRepo.delete(id);
  }
}
