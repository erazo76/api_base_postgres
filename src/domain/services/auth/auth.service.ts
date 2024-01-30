import { Injectable } from "@nestjs/common";
import { Users } from "infrastructure/database/mapper/Users.entity";
import { IAuthService } from "domain/services/auth/IAuthService.interface";
import { constants } from "domain/shared/constants";
import { JwtService, JwtSignOptions } from "@nestjs/jwt";
import * as crypto from "crypto";
import { IUsersUseCase } from "application/ports/UseCases/UsersUseCase/IUsersUseCase.interface";

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly userUseCase: IUsersUseCase,
    private readonly jwtService: JwtService
  ) {}

  verifyUser(username: string, password: any): Promise<Users> {
    return new Promise(async (resolve) => {
      try {
        let user = await this.userUseCase.getUserByUserNameOrEmail(username);
        console.log("user: ", user);
        let hashPass = crypto
          .createHmac("sha256", `${user.salt}${password}${constants.API_SALT}`)
          .digest("hex");
        if (hashPass === user.password && user.active === true) {
          resolve(user);
        } else {
          resolve(null);
        }
      } catch (error) {
        console.log("error: ", error);
        resolve(null);
      }
    });
  }

  async login(user: Users) {
    let signOptions: JwtSignOptions = {
      secret: constants.API_JWT_SECRET,
    };
    const payload = {
      email: user.email,
      userId: user.id,
      roles: user.role,
      username: user.userName,
      fullName: user.name,
      active: user.active,
    };
    return {
      access_token: this.jwtService.sign(payload, signOptions),
      user,
    };
  }
}
