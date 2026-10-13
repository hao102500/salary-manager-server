import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../database/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 查询用户列表
   */
  async findAll() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        companyId: true,
        departmentId: true,
        username: true,
        realName: true,
        phone: true,
        email: true,
        status: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
        department: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      list: users,
      total: users.length,
    };
  }

  /**
   * 根据 ID 查询用户详情
   */
  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        companyId: true,
        departmentId: true,
        username: true,
        realName: true,
        phone: true,
        email: true,
        status: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
        department: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    return user;
  }

  /**
   * 创建用户
   */
  async create(dto: CreateUserDto) {
    // 检查登录账号是否已存在
    const existingUser = await this.prisma.user.findUnique({
      where: { username: dto.username },
      select: { id: true },
    });

    if (existingUser) {
      throw new ConflictException('登录账号已存在');
    }

    // 检查企业是否存在
    const company = await this.prisma.company.findUnique({
      where: { id: dto.companyId },
      select: { id: true },
    });

    if (!company) {
      throw new NotFoundException('所属企业不存在');
    }

    // 检查部门是否属于该企业
    if (dto.departmentId) {
      const department = await this.prisma.department.findFirst({
        where: {
          id: dto.departmentId,
          companyId: dto.companyId,
        },
        select: { id: true },
      });

      if (!department) {
        throw new NotFoundException('部门不存在或不属于当前企业');
      }
    }

    // 密码哈希，不保存明文密码
    const passwordHash = await bcrypt.hash(dto.password, 12);

    try {
      return await this.prisma.user.create({
        data: {
          companyId: dto.companyId,
          departmentId: dto.departmentId,
          username: dto.username,
          passwordHash,
          realName: dto.realName,
          phone: dto.phone,
          email: dto.email,
        },
        select: {
          id: true,
          companyId: true,
          departmentId: true,
          username: true,
          realName: true,
          phone: true,
          email: true,
          status: true,
          createdAt: true,
        },
      });
    } catch (error: unknown) {
      // 处理并发情况下的唯一约束冲突
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('登录账号已存在');
      }

      throw error;
    }
  }
}
