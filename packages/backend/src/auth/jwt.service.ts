import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthJwtService {
  constructor(private readonly jwt: JwtService) {}
  sign(payload: any) {
    return this.jwt.sign(payload);
  }
}
