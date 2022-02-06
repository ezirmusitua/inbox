import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthConfig } from "./config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly config: AuthConfig) {
    super({
      // NOTE: 前端需要添加 Authorization:  Bearer <auth_token>
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      ...config.jwt,
    });
  }

  async validate(payload: any) {
    return { _id: payload._id };
  }
}
