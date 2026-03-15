import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3001);

  app.use(helmet());

  app.enableCors({
    origin: '*', // Allows requests from Vercel or any other domain
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  app.setGlobalPrefix('api/v1');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Aurum API')
    .setDescription(
      'Aurum - Premium Investment Platform API. Manage portfolios, track market data, and access real-time financial insights.',
    )
    .setVersion('1.0')
    .addTag('Currencies', 'Real-time currency data (crypto & forex)')
    .addTag('Market Data', 'Real-time market information')
    .addTag('Portfolio', 'Portfolio management')
    .addTag('Assets', 'Investment assets')
    .addTag('News', 'Financial news')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Aurum API Docs',
    customfavIcon: '/favicon.ico',
    customCss: `
      .swagger-ui .topbar { background-color: #0a0a0a; }
      .swagger-ui .topbar-wrapper .link span { color: #d4af37; }
    `,
  });

  await app.listen(port);
  console.log(`\n🚀 Aurum Backend running on: http://localhost:${port}`);
  console.log(`📚 API Docs available at: http://localhost:${port}/api/docs\n`);
}

bootstrap();
