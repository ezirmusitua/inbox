import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "app.controller";
import { AppService } from "app.service";
import { ArticleModule } from "article/module";
import { AuthModule } from "auth/module";
import { SettingModule } from "setting/module";
import configuration from "configuration";

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
        type: config.get("db_type") as any,
        host: config.get("db_host"),
        port: parseInt(config.get("db_port")),
        database: config.get("db_database") as any,
        autoLoadEntities: true,
        entities: ["schema/*.js"],
        useUnifiedTopology: true,
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
