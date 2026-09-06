import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthType } from './type/auth.type.js';
import { CreateUserDto } from '../users/dto/create.user.dto.js';
@Injectable()
export class AuthService {
  saltOrRounds: number = 10;
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(payload: CreateUserDto) {
    const user = await this.usersService.create(payload);
    return user;
  }

  async signIn(email: string, password: string): Promise<AuthType> {
    const user = await this.usersService.findOne(email);

    if (!user) {
      throw new UnauthorizedException();
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, username: user.email };
    return {
      email,
      password,
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
