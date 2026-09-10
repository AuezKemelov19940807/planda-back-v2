import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class GqlAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlContext = GqlExecutionContext.create(context);

    const request = gqlContext.getContext<{
      req: {
        cookies?: {
          access_token?: string;
        };
        user?: {
          sub: string;
          username: string;
        };
      };
    }>().req;

    const token = request.cookies?.access_token;

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);

      request.user = payload;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }
}
