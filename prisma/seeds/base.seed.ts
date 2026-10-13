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
  // 1. 初始化演示企业：不存在时创建，存在时复用
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
    },
  });

  console.log('企业：', company.name);

  // 2. 初始化部门
  const departments = [
    { name: '总经办', code: 'GENERAL', sort: 1 },
    { name: '人力资源部', code: 'HR', sort: 2 },
    { name: '财务部', code: 'FINANCE', sort: 3 },
    { name: '技术部', code: 'TECH', sort: 4 },
  ];

  for (const item of departments) {
    await prisma.department.upsert({
      where: {
        companyId_code: {
          companyId: company.id,
          code: item.code,
        },
      },
      update: {
        name: item.name,
        sort: item.sort,
      },
      create: {
        companyId: company.id,
        name: item.name,
        code: item.code,
        sort: item.sort,
      },
    });
  }

  console.log(`部门初始化成功：${departments.length} 个`);

  // 3. 初始化角色
  const roles = [
    {
      name: '超级管理员',
      code: 'SUPER_ADMIN',
      description: '系统级管理角色',
    },
    {
      name: '企业管理员',
      code: 'COMPANY_ADMIN',
      description: '管理本企业的组织、员工和业务数据',
    },
    {
      name: '人事专员',
      code: 'HR_SPECIALIST',
      description: '负责员工档案及人力资源相关业务',
    },
    {
      name: '财务专员',
      code: 'FINANCE_SPECIALIST',
      description: '负责薪资核算及财务相关业务',
    },
    {
      name: '普通员工',
      code: 'EMPLOYEE',
      description: '普通员工业务角色',
    },
  ];

  for (const item of roles) {
    await prisma.role.upsert({
      where: {
        code: item.code,
      },
      update: {
        name: item.name,
        description: item.description,
      },
      create: item,
    });
  }

  console.log(`角色初始化成功：${roles.length} 个`);
}

main()
  .catch((error: unknown) => {
    console.error('基础数据初始化失败：', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });