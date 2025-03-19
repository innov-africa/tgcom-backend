import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'https://caisse-menu-depense.web.app',
      'https://compta-tgcom.web.app',
      'http://localhost:8100',
    ],
  });
  app.setGlobalPrefix('api/v1');
  await app.listen(process.env.PORT ?? 3000, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
}
bootstrap();
