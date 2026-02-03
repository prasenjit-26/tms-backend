import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Public } from './public.decorator';
import { LoginInput } from './auth.inputs';
import { AuthPayload } from './auth.types';
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Mutation(() => AuthPayload)
  async login(@Args('input') input: LoginInput): Promise<AuthPayload> {
    return this.authService.login(input.email, input.password);
  }
}
