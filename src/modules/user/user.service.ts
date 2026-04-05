import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/User.entity';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from './user.types';

@Injectable()
export class UserService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
  ) {}

  list() {
    return this.userRepo.find();
  }

  findUserById(id: number) {
    return this.userRepo.findOne({ where: { id } });
  }

  async createGuest(ip: string) {
    const randomValue = crypto.hash('sha256', ip);
    let user = await this.userRepo.findOne({
      where: { username: `guest-${randomValue}` },
    });

    if (!user) {
      user = this.userRepo.create({
        username: `guest_${randomValue}`,
        password: `guest-${randomValue}`,
        fullName: `Guest ${randomValue}`,
        role: UserRole.GUEST,
      });

      await user.save();
    }

    const token = this.jwtService.sign({ userId: user.id });

    return {
      user: {
        ...user,
        password: undefined,
        gender: undefined,
      },
      token,
    };
  }
}
