import { IUser } from '@app/users-lib';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const user = context
      .switchToHttp()
      .getRequest<Request & { user: IUser }>().user;
    return user;
  },
);
