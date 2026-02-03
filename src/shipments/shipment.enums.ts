import { registerEnumType } from '@nestjs/graphql';

export enum ShipmentStatus {
  created = 'created',
  booked = 'booked',
  in_transit = 'in_transit',
  delivered = 'delivered',
  cancelled = 'cancelled',
}

registerEnumType(ShipmentStatus, {
  name: 'ShipmentStatus',
});
