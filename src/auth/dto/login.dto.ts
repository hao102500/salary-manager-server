import { IsString, Length, MaxLength } from 'class-validator';

export class LoginDto {
  @IsString({ message: '用户名必须是字符串' })
  @Length(3, 50, { message: '用户名长度必须为 3～50 个字符' })
  username: string;

  @IsString({ message: '密码必须是字符串' })
  @Length(1, 72, { message: '密码长度不能超过 72 个字符' })
  @MaxLength(72, { message: '密码长度不能超过 72 个字符' })
  password: string;
}