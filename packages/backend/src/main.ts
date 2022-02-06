import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger } from "@nestjs/common";
import configuration from "configuration";

async function bootstrap() {
  const logger = new Logger();
  const config = configuration();
  const app = await NestFactory.create(AppModule, {
    logger: ["error", "warn", "log", "debug"],
  });
  app.useLogger(logger);
  app.enableCors();
  const openapi_config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle("inbox REST APIs")
    .setDescription("The inbox app api")
    .setVersion("0.1.1")
    .addTag("cric_ywh")
    .build();
  const document = SwaggerModule.createDocument(app, openapi_config);
  SwaggerModule.setup("api_document", app, document);
  logger.log(
    `\n${"- *".repeat(10)} starting at ${process.env.host}:${
      process.env.port
    } ${"- *".repeat(10)}\n`,
  );
  await app.listen(config.port, config.host);
}
bootstrap();
