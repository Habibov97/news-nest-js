import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/User.entity';
import { Repository } from 'typeorm';
import { AuthRegisterDto } from './dto/auth-register.dto';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
  ) {}

  async register(params: AuthRegisterDto) {
    const checkUserName = await this.userRepo.exists({
      where: { username: params.username },
    });

    if (checkUserName) throw new ConflictException('Username already exists');

    const user = this.userRepo.create(params);

    await this.userRepo.save(user);

    return user;
  }

  login() {}
}
