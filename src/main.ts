import { ValidationPipe, VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter } from "@nestjs/platform-fastify";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new FastifyAdapter());

  app.enableCors();
  app.enableVersioning({ type: VersioningType.URI });
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(
    process.env.PORT !== undefined ? +process.env.PORT : 3000,
    process.env.HOST ?? "127.0.0.1"
  );
}

void bootstrap();
