
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import configuration from './config/configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
// PrismaModule
import { PrismaModule } from './database/prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ // 读取 .env 环境变量
      isGlobal: true, // 全局注册 ConfigModule，其他模块无需再导入
      envFilePath: '.env', // 明确本地配置文件的位置
      load: [configuration], // 加载统一配置
    }),
    PrismaModule, // 数据库模块
    HealthModule, // 健康检查模块
  ],
  controllers: [AppController], // 注册控制器
  providers: [AppService], // 注册服务
})
export class AppModule {}
