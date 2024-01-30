import { Module } from "@nestjs/common";
import { IUsersRepository } from "application/ports/Repository/UsersRepository/IUsersRepository.interface";
import { IUsersUseCase } from "application/ports/UseCases/UsersUseCase/IUsersUseCase.interface";
import { UsersUseCase } from "application/use-cases/UsersUseCase/UsersUseCase";
import { MailService } from "domain/services/mailer/mailer.service";
import { UsersRepository } from "infrastructure/database/repositories/Users.repository";
import { UsersController } from "presentation/controllers/UsersController";
import { MailModule } from "./mailer.module";

@Module({
  controllers: [UsersController],
  imports: [MailModule],
  providers: [
    MailService,
    {
      provide: IUsersUseCase,
      useClass: UsersUseCase,
    },
    {
      provide: IUsersRepository,
      useClass: UsersRepository,
    },
  ],
})
export class UsersModule {}
