import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfiguration } from './app-configuration';
import { initSwaggerDoc } from './lib/swagger/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  initSwaggerDoc(app);

  await app.listen(AppConfiguration.applicationPort);
}


bootstrap();
