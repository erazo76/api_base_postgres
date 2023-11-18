import { Injectable } from "@nestjs/common";
import { IUsersRepository } from "application/ports/Repository/UsersRepository/IUsersRepository.interface";
import { IUsersUseCase } from "application/ports/UseCases/UsersUseCase/IUsersUseCase.interface";
import { Page, PageMeta, PageOptions } from "infrastructure/common/page";
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

  async getUsersPag(pageOpts: PageOptions): Promise<Page<Users>> {
    const [users, count] = await this.usersRepo.findAndCount({
      skip: (pageOpts.page - 1) * pageOpts.take,
      take: pageOpts.take,
    });
    const pageMeta = new PageMeta(pageOpts, count);
    return new Page(users, pageMeta);
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
