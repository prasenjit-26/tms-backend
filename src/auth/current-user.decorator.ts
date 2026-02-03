import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export type RequestUser = {
  id: string;
  email: string;
  role: string;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): RequestUser | undefined => {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;
    return req?.user as RequestUser | undefined;
  },
);
