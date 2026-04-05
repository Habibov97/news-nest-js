import { Controller, Get, Ip, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('users')
@ApiBearerAuth()
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  list() {
    return this.userService.list();
  }

  @Post('guest')
  createGuest(@Ip() userIp: string) {
    const user = this.userService.createGuest(userIp);
    return user;
  }
}
