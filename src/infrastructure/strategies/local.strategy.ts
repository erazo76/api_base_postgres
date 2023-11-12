/* eslint-disable prettier/prettier */
import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Users } from "infrastructure/database/mapper/Users.entity";
import { IAuthUseCase } from "application/ports/UseCases/AuthUseCase/IAuthUseCase.interface";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, "local") {
  constructor(private readonly authUseCase: IAuthUseCase) {
    super({
      usernameField: "userName",
    });
  }

  async validate(userName: string, password: string): Promise<Users> {
    const user = await this.authUseCase.validateUserCredentials(
      userName,
      password
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
