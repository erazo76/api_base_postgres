import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { IAuthUseCase } from "application/ports/UseCases/AuthUseCase/IAuthUseCase.interface";
import { IUsersUseCase } from "application/ports/UseCases/UsersUseCase/IUsersUseCase.interface";
import { Users } from "infrastructure/database/mapper/Users.entity";
import * as crypto from "crypto";
import { Credentials } from "infrastructure/interfaces/credentials.interface";
import { UserPayload } from "infrastructure/interfaces/current-user.interface";

@Injectable()
export class AuthUseCase implements IAuthUseCase {
  constructor(
    private readonly userUseCase: IUsersUseCase,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async login(users: Users): Promise<Credentials> {
    return this.getAccessToken(users);
  }

  async getAccessToken(user: Users): Promise<Credentials> {
    const payload: UserPayload = {
      id: user.id,
      userName: user.userName,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
      address: user.address,
    };

    const token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>("ACCESS_TOKEN_SECRET"),
    });
    return {
      accessToken: token,
      payload: payload,
    };
  }

  async validateUserCredentials(
    userName: string,
    password: any
  ): Promise<Users | null> {
    try {
      let user = await this.userUseCase.getUserByUserNameOrEmail(userName);
      let hashPass = crypto
        .createHmac(
          "sha256",
          `${user.salt}${password}${this.configService.get<string>("API_SALT")}`
        )
        .digest("hex");
      if (hashPass === user.password) {
        return user;
      } else {
        return null;
      }
    } catch (error) {
      console.log("error: ", error);
      return null;
    }
  }
}
