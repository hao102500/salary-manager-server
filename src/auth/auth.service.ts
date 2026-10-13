import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../database/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(dto: LoginDto) {
    // 1. 查询用户及其企业、角色
    const user = await this.prisma.user.findUnique({
      where: {
        username: dto.username,
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            code: true,
            status: true,
          },
        },
        userRoles: {
          include: {
            role: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
          },
        },
      },
    });

    // 2. 统一处理用户名不存在和密码错误
    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    const passwordValid = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );

    if (!passwordValid) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    // 3. 检查账号及企业状态
    if (user.status !== 'ACTIVE') {
      throw new ForbiddenException('账号已禁用');
    }

    if (user.company.status !== 'ACTIVE') {
      throw new ForbiddenException('所属企业已停用');
    }

    // 4. 提取角色编码
    const roles = user.userRoles.map((item) => item.role.code);

    // 5. 签发 JWT
    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      username: user.username,
      companyId: user.companyId,
      roles,
    });

    // 6. 更新最后登录时间
    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        lastLoginAt: new Date(),
      },
    });

    // 7. 返回令牌及安全的用户信息
    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn: this.configService.get<string>(
        'JWT_EXPIRES_IN',
        '2h',
      ),
      user: {
        id: user.id,
        username: user.username,
        realName: user.realName,
        phone: user.phone,
        email: user.email,
        company: user.company,
        roles: user.userRoles.map((item) => item.role),
      },
    };
  }
}