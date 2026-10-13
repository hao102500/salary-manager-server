import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  /** 所属企业 ID */
  @IsString()
  @Length(1, 30)
  companyId: string;

  /** 部门 ID，可选 */
  @IsOptional()
  @IsString()
  @MaxLength(30)
  departmentId?: string;

  /** 登录账号 */
  @IsString()
  @Length(3, 50)
  username: string;

  /** 登录密码 */
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password: string;

  /** 真实姓名 */
  @IsString()
  @Length(1, 50)
  realName: string;

  /** 手机号 */
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  /** 邮箱 */
  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  email?: string;
}