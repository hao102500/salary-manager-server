import 'dotenv/config';

import * as bcrypt from 'bcrypt';
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
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD;

  if (!password || password.length < 8 || password.length > 72) {
    throw new Error(
      '请在 .env 中设置 ADMIN_PASSWORD，长度必须为 8～72 个字符',
    );
  }

  // 1. 查询演示企业
  const company = await prisma.company.findUnique({
    where: { code: 'SALARY_MANAGER_DEMO' },
  });

  if (!company) {
    throw new Error('演示企业不存在，请先执行 base.seed.ts');
  }

  // 2. 查询总经办
  const department = await prisma.department.findUnique({
    where: {
      companyId_code: {
        companyId: company.id,
        code: 'GENERAL',
      },
    },
  });

  if (!department) {
    throw new Error('总经办不存在，请先执行 base.seed.ts');
  }

  // 3. 查询超级管理员角色
  const role = await prisma.role.findUnique({
    where: { code: 'SUPER_ADMIN' },
  });

  if (!role) {
    throw new Error('超级管理员角色不存在，请先执行 base.seed.ts');
  }

  // 4. 创建管理员；已存在时不重置原密码
  const existingUser = await prisma.user.findUnique({
    where: { username },
  });

  const user =
    existingUser ??
    (await prisma.user.create({
      data: {
        username,
        passwordHash: await bcrypt.hash(password, 12),
        realName: '系统管理员',
        companyId: company.id,
        departmentId: department.id,
      },
    }));

  // 5. 关联超级管理员角色
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: user.id,
        roleId: role.id,
      },
    },
    update: {},
    create: {
      userId: user.id,
      roleId: role.id,
    },
  });

  console.log('管理员初始化成功：', {
    username: user.username,
    realName: user.realName,
    company: company.name,
    department: department.name,
    role: role.name,
    passwordReset: false,
  });
}

main()
  .catch((error: unknown) => {
    console.error('管理员初始化失败：', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });