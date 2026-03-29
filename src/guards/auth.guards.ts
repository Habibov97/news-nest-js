import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    let token = request.headers.authorization || '';
    token = token.split(' ')[1];
    if (!token) throw new UnauthorizedException('Unauthorized!');

    try {
      const payload = this.jwtService.verify(token);
      const user = this.userService.findUserById(payload.userId);
      if (!user) throw new Error();
      request['user'] = user;

      return true;
    } catch {
      throw new UnauthorizedException('Unauthorized!');
    }
  }
}
