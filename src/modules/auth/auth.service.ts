import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/User.entity';
import { Repository } from 'typeorm';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { AuthLoginDto } from './dto/auth-login.dto';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
  ) {}

  async register(params: AuthRegisterDto) {
    const checkUserName = await this.userRepo.exists({
      where: { username: params.username },
    });

    if (checkUserName) throw new ConflictException('Username already exists');

    const user = this.userRepo.create(params);

    await this.userRepo.save(user);

    return {
      user: {
        ...user,
        password: undefined,
      },
    };
  }

  async login(params: AuthLoginDto) {
    const user = await this.userRepo.findOne({
      where: { username: params.username },
    });
    if (!user)
      throw new UnauthorizedException('User or password is incorrect!');

    const checkPassword = await compare(params.password, user.password);
    if (!checkPassword)
      throw new UnauthorizedException('User or password is incorrect!');

    const token = this.jwtService.sign({ userId: user.id });

    return {
      user: {
        ...user,
        password: undefined,
      },
      token,
    };
  }
}
