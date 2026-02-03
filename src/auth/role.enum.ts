import { registerEnumType } from '@nestjs/graphql';

export enum Role {
  admin = 'admin',
  employee = 'employee',
}

registerEnumType(Role, {
  name: 'Role',
});
