import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards
} from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * GET /api/v1/users
   */
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  /**
   * GET /api/v1/users/:id
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
  return this.usersService.findOne(id);
}

  /**
   * POST /api/v1/users
   */
  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }
}
