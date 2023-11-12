/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { UserPayload } from "infrastructure/interfaces/current-user.interface";
import { Strategy, ExtractJwt } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: JSON.parse(
        config.get<string>("ACCESS_TOKEN_IGNORE_EXPIRATION")!
      ), // convert to boolean
      secretOrKey: config.get<string>("ACCESS_TOKEN_SECRET"),
    });
  }

  async validate(payload: UserPayload) {
    return payload;
  }
}
