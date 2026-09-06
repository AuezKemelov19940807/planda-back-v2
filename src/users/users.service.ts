import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create.user.dto';
import { prisma } from '../lib/prisma.js';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UsersService {
  async create(dto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await prisma.user.create({
      data: {
        ...dto,
        password: hashedPassword,
      },
    });

    return user;
  }

  async findOne(email: string) {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  }
}
