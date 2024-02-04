import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { IUsersRepository } from "application/ports/Repository/UsersRepository/IUsersRepository.interface";
import { IUsersUseCase } from "application/ports/UseCases/UsersUseCase/IUsersUseCase.interface";
import { MailService } from "domain/services/mailer/mailer.service";
import { Page, PageMeta, PageOptions } from "infrastructure/common/page";
import { Users } from "infrastructure/database/mapper/Users.entity";
import { DeleteResult, UpdateResult } from "typeorm";
import * as cronParser from "cron-parser";

const TWO_MONTHS = "0 0 1 */3 *";

@Injectable()
export class UsersUseCase implements IUsersUseCase {
  private nextResetDate: string;
  constructor(
    private readonly usersRepo: IUsersRepository,
    private mailService: MailService
  ) {}

  @Cron(TWO_MONTHS)
  private async resetUsersPoint(): Promise<void> {
    const user = await this.usersRepo.find();
    this.calculateNextResetDate();
    user.map((e) => {
      e.points = 0;
      e.resetpointsat = this.nextResetDate;
      this.updateUser(e);
    });
  }

  async initResetDate(): Promise<void> {
    const user = await this.usersRepo.find();
    this.calculateNextResetDate();
    user.map((e) => {
      e.resetpointsat = this.nextResetDate;
      this.updateUser(e);
    });
  }

  private calculateNextResetDate(): void {
    const interval = cronParser.parseExpression(TWO_MONTHS);
    const nextResetDate = interval.next();
    this.nextResetDate = nextResetDate.toString();
  }

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

  async createUser(
    moduleModel: Users,
    protocol: string,
    host: string
  ): Promise<Users> {
    const { email, name } = moduleModel;
    try {
      const result = await this.usersRepo.save(moduleModel);
      const urlConfirm = `${protocol}://${host}`;

      await this.mailService.sendEMail(email, "Validación de registro", {
        userId: result.id,
        url: urlConfirm,
        name: name,
      });
      return result;
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

  async countUser(): Promise<number> {
    return await this.usersRepo.count();
  }

  async validateRegister(userId: string): Promise<void> {
    const user = await this.getUserById(userId);
    user.active = true;
    await this.updateUser(user);
  }

  async getDataUserByEmail(email: string): Promise<void> {
    try {
      const user = await this.getUserByUserNameOrEmail(email);
      await this.mailService.sendEMailB(email, "Datos de usuario", {
        userName: user.userName,
        phone: user.phone,
        name: user.name,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async addPoint(userId: string, point: number): Promise<number> {
    const user = await this.getUserById(userId);
    user.points = Number(user.points) + Number(point);
    await this.updateUser(user);
    return user.points;
  }
}
