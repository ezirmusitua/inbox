import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "app.controller";
import { AppService } from "app.service";
import { ArticleModule } from "article/module";
import { AuthModule } from "auth/module";
import configuration from "configuration";
import { SettingModule } from "setting/module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: false,
      load: [configuration],
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        autoLoadEntities: true,
        autoSave: true,
        entities: ["schema/*.js"],
        location: config.get("db_location") as any,
        synchronize: true,
        type: config.get("db_type") as any,
      }),
    }),
    AuthModule,
    ArticleModule,
    SettingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
