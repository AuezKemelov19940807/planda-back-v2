import { Module } from '@nestjs/common';

import { AuthService } from './auth.service.js';
import { UsersModule } from '../users/users.module.js';
import { jwtConstants } from './constants.js';
import { JwtModule } from '@nestjs/jwt';
import { AuthResolver } from './auth.resolver.js';
import { MailModule } from '../mail/mail.module.js';

@Module({
  imports: [
    UsersModule,
    MailModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [AuthService, AuthResolver],
  controllers: [],
  exports: [AuthService],
})
export class AuthModule {}
