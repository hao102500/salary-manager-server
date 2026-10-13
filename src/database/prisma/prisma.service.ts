
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../../generated/prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly configService: ConfigService) {

    console.log('Prisma 数据库配置：', {
      host: configService.get<string>('MYSQL_HOST'),
      port: configService.get<string>('MYSQL_PORT'),
      user: configService.get<string>('MYSQL_USER'),
      database: configService.get<string>('MYSQL_DATABASE'),
      passwordConfigured: Boolean(
        configService.get<string>('MYSQL_PASSWORD'),
      ),
    });
    
    const adapter = new PrismaMariaDb({
      host: configService.get<string>('MYSQL_HOST', '127.0.0.1'),
      port: Number(configService.get<string>('MYSQL_PORT', '3306')),
      user: configService.get<string>('MYSQL_USER', 'salary_app'),
      password: configService.get<string>('MYSQL_PASSWORD', ''),
      database: configService.get<string>(
        'MYSQL_DATABASE',
        'salary_manager',
      ),
      connectionLimit: 5,
    });

    super({ adapter });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
