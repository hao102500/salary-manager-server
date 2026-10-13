import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

interface JwtPayload {
  sub: string;
  username: string;
  companyId: string;
  roles: string[];
}

interface AuthenticatedRequest {
  headers: {
    authorization?: string;
  };
  user?: JwtPayload;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request =
      context.switchToHttp().getRequest<AuthenticatedRequest>();

    const authorization = request.headers.authorization;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedException('请先登录');
    }

    const token = authorization.slice(7).trim();

    if (!token) {
      throw new UnauthorizedException('登录令牌无效');
    }

    try {
      request.user = await this.jwtService.verifyAsync<JwtPayload>(
        token,
        {
          issuer: 'salary-manager-server',
        },
      );

      return true;
    } catch {
      throw new UnauthorizedException('登录令牌无效或已过期');
    }
  }
}