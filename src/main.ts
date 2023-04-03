import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { GlobalHttpExceptionFilter } from './utils/helpers/GlobalHttpExceptionFilter';
import { GlobalHttpResponseInterceptor } from './utils/helpers/GlobalHttpResponseInterceptor';
import { BackendConfigService } from './config/config.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalFilters(new GlobalHttpExceptionFilter());
  app.useGlobalInterceptors(new GlobalHttpResponseInterceptor());
  app.useStaticAssets(join(__dirname, '..', 'static'));
  const backendConfigService = app.get(BackendConfigService);
  await app.listen(backendConfigService.port);
}
bootstrap();
