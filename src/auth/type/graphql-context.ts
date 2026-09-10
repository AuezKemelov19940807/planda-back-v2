import type { Request, Response } from 'express';

export interface GraphQLContext {
  req: Request & {
    user?: {
      sub: string;
      username: string;
    };
  };
  res: Response;
}
