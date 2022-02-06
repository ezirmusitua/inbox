import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthConfig } from './config';
import { AuthJwtService } from './jwt.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get('jwt_secret'),
        signOptions: { expiresIn: config.get('jwt_expires') },
      }),
    }),
  ],
  providers: [JwtStrategy, AuthConfig, AuthJwtService],
  exports: [JwtStrategy, AuthJwtService],
})
export class AuthModule {}
