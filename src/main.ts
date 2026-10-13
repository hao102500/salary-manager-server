import { NestFactory } from '@nestjs/core';
// @nestjs/config
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
// 全局异常过滤器
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
// 全局响应拦截器
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 允许跨域请求
  const configService = app.get(ConfigService);
  // 1. 读取统一配置
  const port = configService.get<number>('app.port') ?? 3000;
  const apiPrefix = configService.get<string>('app.apiPrefix', 'api');
  const apiVersion = configService.get<string>('app.apiVersion', 'v1');
  const corsOrigins = configService.get<string[]>('app.corsOrigins', [
    'http://localhost:5173',
  ]);

  // 2. 统一 API 前缀
  app.setGlobalPrefix(`${apiPrefix}/${apiVersion}`);

  // 全局请求参数校验
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 剔除 DTO 中未声明的字段
      forbidNonWhitelisted: true, // 如果请求中包含未声明的字段，则抛出异常
      transform: true, // 自动类型转换，将请求参数转换为 DTO 中声明的类型
    }),
  );

  // 全局异常过滤器
  app.useGlobalFilters(new HttpExceptionFilter());

  // 全局响应拦截器
  app.useGlobalInterceptors(new TransformInterceptor());

  // 3. 跨域配置
  app.enableCors({
    origin: corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // 4. 启动服务
  await app.listen(port);

  console.log(`服务地址：http://localhost:${port}`);
  console.log(`接口前缀：http://localhost:${port}/${apiPrefix}/${apiVersion}`);
}


bootstrap();
