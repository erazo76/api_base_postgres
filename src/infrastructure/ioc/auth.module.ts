import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "./users.module";
import { LocalStrategy } from "../strategies/local.strategy";
import { JwtStrategy } from "../strategies/jwt.strategy";
import { IAuthUseCase } from "application/ports/UseCases/AuthUseCase/IAuthUseCase.interface";
import { AuthUseCase } from "application/use-cases/AuthUseCase/AuthUseCase";
import { AuthController } from "presentation/controllers/AuthController";
import { UsersUseCase } from "application/use-cases/UsersUseCase/UsersUseCase";
import { IUsersUseCase } from "application/ports/UseCases/UsersUseCase/IUsersUseCase.interface";
import { IUsersRepository } from "application/ports/Repository/UsersRepository/IUsersRepository.interface";
import { UsersRepository } from "infrastructure/database/repositories/Users.repository";
import { MailModule } from "./mailer.module";
import { MailService } from "domain/services/mailer/mailer.service";

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({}),
    ConfigModule,
    MailModule,
  ],
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
    {
      provide: IAuthUseCase,
      useClass: AuthUseCase,
    },
    LocalStrategy,
    JwtStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
