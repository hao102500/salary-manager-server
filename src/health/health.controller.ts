import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';

@Controller('health')
export class HealthController {

  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async checkHealth() {

    try {
      // 执行最简单的数据库查询，验证 MySQL 连接
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        status: 'ok',
        service: 'salary-manager-server',
        database: 'connected',
      };
    } catch (error) {
      console.error('数据库连接失败，原始错误：', error);
      throw new ServiceUnavailableException({
        message: '数据库连接失败',
        database: 'disconnected',
      });
    }
  }
}
