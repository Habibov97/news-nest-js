import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserService } from 'src/modules/user/user.service';
import { UserRole } from 'src/modules/user/user.types';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    let token = request.headers.authorization || '';
    token = token.split(' ')[1];
    if (!token) throw new UnauthorizedException('Unauthorized!');

    try {
      const payload = this.jwtService.verify(token);
      const user = await this.userService.findUserById(payload.userId);
      if (!user) throw new UnauthorizedException('Unauthorized!');

      const roles: UserRole[] | undefined = this.reflector.get(
        'roles',
        context.getHandler(),
      );

      if (roles && !roles.includes(user.role)) {
        throw new ForbiddenException('Forbidden!');
      }

      request['user'] = user;

      return true;
    } catch (err) {
      if (err instanceof ForbiddenException) {
        throw new ForbiddenException('Forbidden!');
      }
      throw new UnauthorizedException('Unauthorized!');
    }
  }
}
