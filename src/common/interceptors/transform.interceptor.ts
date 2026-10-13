
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable, map } from 'rxjs';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, object>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<object> {

    // 获取请求对象
    const request = context.switchToHttp().getRequest<Request>();

    // 在响应数据中添加统一的响应结构，包括状态码、消息、数据、时间戳和请求路径
    return next.handle().pipe(
      map((data) => ({
        code: 200,
        message: 'success',
        data,
        timestamp: new Date().toISOString(),
        path: request.originalUrl,
      })),
    );
  }
}
