import { Injectable, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { UsersService } from '../users/users.service.js';

@Injectable()
export class GoogleAuthService {
  private readonly client: OAuth2Client;

  constructor(private readonly usersService: UsersService) {
    const clientId = process.env.GOOGLE_CLIENT_ID;

    if (!clientId) {
      throw new Error('GOOGLE_CLIENT_ID is not defined');
    }

    this.client = new OAuth2Client(clientId);
  }

  async verifyCredential(credential: string) {
    const ticket = await this.client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.sub || !payload.email || !payload.email_verified) {
      throw new UnauthorizedException('Invalid Google account');
    }

    let user = await this.usersService.findOne(payload.email);

    if (!user) {
      user = await this.usersService.createGoogleUser({
        email: payload.email,
        name: payload.name ?? null,
        avatar: payload.picture ?? null,
        googleId: payload.sub,
      });
    } else if (!user.googleId) {
      user = await this.usersService.connectGoogleAccount(
        user.id,
        payload.sub,
        user.name ?? payload.name ?? null,
        user.avatar ?? payload.picture ?? null,
      );
    }

    return user;
  }
}
