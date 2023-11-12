import { Module } from "@nestjs/common";
import { IUsersRepository } from "application/ports/Repository/UsersRepository/IUsersRepository.interface";
import { IUsersUseCase } from "application/ports/UseCases/UsersUseCase/IUsersUseCase.interface";
import { UsersUseCase } from "application/use-cases/UsersUseCase/UsersUseCase";
import { UsersRepository } from "infrastructure/database/repositories/Users.repository";
import { UsersController } from "presentation/controllers/UsersController";

@Module({
  controllers: [UsersController],
  providers: [
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
