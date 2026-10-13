
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {

  // 日志记录器
  private readonly logger = new Logger(HttpExceptionFilter.name);

  // 捕获异常并处理
  catch(exception: unknown, host: ArgumentsHost): void {

    // 获取请求和响应对象
    const ctx = host.switchToHttp();
    // 获取响应对象和请求对象
    const response = ctx.getResponse<Response>();
    // 获取请求对象
    const request = ctx.getRequest<Request>();

    // 默认按服务器内部错误处理
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = '服务器内部错误';

    // 如果异常是 HttpException 类型，则获取其状态码和消息
    if (exception instanceof HttpException) {
      // 获取异常状态码
      status = exception.getStatus();
      // 获取异常响应内容
      const exceptionResponse = exception.getResponse();
      // 根据异常响应内容的类型，提取消息
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        'message' in exceptionResponse
      ) {
        const exceptionMessage = exceptionResponse.message;

        if (
          typeof exceptionMessage === 'string' ||
          Array.isArray(exceptionMessage)
        ) {
          message = exceptionMessage as string | string[];
        } else {
          message = exception.message;
        }
      } else {
        message = exception.message;
      }
    } else {
      // 服务端记录详细异常，避免将内部信息返回给客户端
      this.logger.error(
        '发生未处理的服务器异常',
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    response.status(status).json({
      code: status,
      message,
      data: null,
      timestamp: new Date().toISOString(),
      path: request.originalUrl,
    });
  }
}
