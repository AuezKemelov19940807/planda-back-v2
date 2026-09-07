import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { CreateUserDto } from './create.user.dto.js';
import { IsUUID } from 'class-validator';

@InputType()
export class UpdateUserDto extends PartialType(CreateUserDto) {
  @Field(() => ID)
  @IsUUID()
  id: string;
}
