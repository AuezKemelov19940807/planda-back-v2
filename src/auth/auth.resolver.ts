import {
  Args,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { AuthService } from './auth.service.js';
import { UserType } from '../users/type/user.type.js';
import { CreateUserDto } from '../users/dto/create.user.dto.js';

@Resolver(() => UserType)
export class AuthResolver {
  constructor(private readonly service: AuthService) {}

  @Mutation(() => UserType)
  async signUp(@Args('payload') payload: CreateUserDto) {
    return this.service.signUp(payload);
  }

  @Mutation(() => UserType)
  async signIn(
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
    return this.service.signIn(email, password);
  }
}
