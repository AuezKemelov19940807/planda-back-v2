import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuthType {
  @Field()
  access_token: string;

  @Field(() => ID)
  id?: string;

  @Field()
  email: string;

  @Field()
  password: string;
}
