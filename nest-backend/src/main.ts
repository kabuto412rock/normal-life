import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const allowlist = ['http://localhost:5173'];
  app.enableCors({ origin: allowlist });
  await app.listen(3000);
}
bootstrap();
