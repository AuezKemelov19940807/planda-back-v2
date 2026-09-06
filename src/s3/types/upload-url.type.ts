import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UploadUrlType {
  @Field(() => String)
  uploadUrl: string;

  @Field(() => String)
  key: string;
}
