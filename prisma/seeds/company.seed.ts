
import 'dotenv/config';

import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../../src/generated/prisma/client';

const adapter = new PrismaMariaDb({
  host: process.env.MYSQL_HOST || '127.0.0.1',
  port: Number(process.env.MYSQL_PORT || '3306'),
  user: process.env.MYSQL_USER || 'salary_app',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'salary_manager',
  connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const company = await prisma.company.upsert({
    where: {
      code: 'SALARY_MANAGER_DEMO',
    },
    update: {},
    create: {
      name: '薪资管家演示企业',
      code: 'SALARY_MANAGER_DEMO',
    },
    select: {
      id: true,
      name: true,
      code: true,
    },
  });

  console.log('企业初始化成功：', company);
}

main()
  .catch((error: unknown) => {
    console.error('企业初始化失败：', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
