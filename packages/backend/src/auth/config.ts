import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface iConfig {
  jwt_secret: string;
  jwt_expires: string;
}

@Injectable()
export class AuthConfig {
  constructor(private readonly config: ConfigService<iConfig>) {}
  get jwt() {
    return {
      secretOrKey: this.config.get('jwt_secret'),
      expiresIn: this.config.get('jwt_expires'),
    };
  }
}
