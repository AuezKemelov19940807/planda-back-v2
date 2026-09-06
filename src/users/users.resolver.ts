import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UsersService } from './users.service.js';
import { UserType } from './type/user.type.js';

@Resolver(() => UserType)
export class UsersResolver {
  constructor(private readonly service: UsersService) {}

  @Query(() => String)
  hello() {
    return 'Planda API works!';
  }

  @Mutation(() => UserType)
  async createUser(
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
    return this.service.create({
      email,
      password,
    });
  }

  @Query(() => UserType, { nullable: true })
  async user(@Args('email') email: string) {
    return this.service.findOne(email);
  }
  @ResolveField(() => String, { nullable: true })
  avatar(@Parent() user: UserType) {
    if (!user.avatar) {
      return null;
    }

    return `${process.env.API_URL}/api/files/${user.avatar}`;
  }
}
