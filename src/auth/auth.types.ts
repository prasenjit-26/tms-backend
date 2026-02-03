import { Field, ObjectType } from '@nestjs/graphql';
import { Role } from './role.enum';

@ObjectType()
export class AuthUser {
  @Field()
  id!: string;

  @Field()
  email!: string;

  @Field(() => Role)
  role!: Role;
}

@ObjectType()
export class AuthPayload {
  @Field()
  accessToken!: string;

  @Field(() => AuthUser)
  user!: AuthUser;
}
