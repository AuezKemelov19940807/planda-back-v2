import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create.user.dto';
import { prisma } from '../lib/prisma.js';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update.user.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { GraphQLError } from 'graphql';

@Injectable()
export class UsersService {
  async create(dto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    try {
      return await prisma.user.create({
        data: {
          ...dto,
          password: hashedPassword,
        },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new GraphQLError('Email already exists', {
          extensions: {
            code: 'CONFLICT',
          },
        });
      }
      throw error;
    }
  }

  async findOne(email: string) {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async update(dto: UpdateUserDto) {
    const { id, ...data } = dto;

    try {
      return await prisma.user.update({
        where: {
          id,
        },
        data,
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new GraphQLError('User not found', {
          extensions: {
            code: 'NOT_FOUND',
          },
        });
      }

      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await prisma.user.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new GraphQLError('User not found', {
          extensions: {
            code: 'NOT_FOUND',
          },
        });
      }
      throw error;
    }
  }

  async savePasswordResetCode(id: string, codeHash: string, expiresAt: Date) {
    return prisma.user.update({
      where: { id },
      data: {
        resetPasswordTokenHash: codeHash,
        resetPasswordExpiresAt: expiresAt,
      },
    });
  }

  async updatePassword(id: string, password: string) {
    return prisma.user.update({
      where: { id },
      data: {
        password,
        resetPasswordTokenHash: null,
        resetPasswordExpiresAt: null,
      },
    });
  }

  async findById(id: string) {
    return prisma.user.findUnique({
      where: {
        id,
      },
    });
  }
}
