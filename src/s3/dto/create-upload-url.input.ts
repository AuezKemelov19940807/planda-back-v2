import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateUploadUrlInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  contentType: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  folder: string;
}
