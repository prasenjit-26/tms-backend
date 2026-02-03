import {
  Field,
  GraphQLISODateTime,
  ID,
  Int,
  ObjectType,
} from '@nestjs/graphql';
import { ShipmentStatus } from './shipment.enums';

@ObjectType()
export class TrackingEvent {
  @Field(() => ID)
  id!: string;

  @Field(() => ShipmentStatus)
  status!: ShipmentStatus;

  @Field()
  message!: string;

  @Field()
  location!: string;

  @Field(() => GraphQLISODateTime)
  occurredAt!: Date;
}

@ObjectType()
export class Shipment {
  @Field(() => ID)
  id!: string;

  @Field()
  referenceNumber!: string;

  @Field()
  shipperName!: string;

  @Field()
  carrierName!: string;

  @Field()
  pickupLocation!: string;

  @Field()
  deliveryLocation!: string;

  @Field(() => GraphQLISODateTime)
  pickupDate!: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  deliveryDate?: Date | null;

  @Field(() => ShipmentStatus)
  status!: ShipmentStatus;

  @Field(() => Int)
  rateCents!: number;

  @Field()
  currency!: string;

  @Field()
  flagged!: boolean;

  @Field(() => GraphQLISODateTime)
  createdAt!: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt!: Date;

  @Field(() => [TrackingEvent])
  trackingEvents!: TrackingEvent[];
}

@ObjectType()
export class ShipmentConnection {
  @Field(() => [Shipment])
  nodes!: Shipment[];

  @Field(() => Int)
  totalCount!: number;

  @Field(() => Int)
  page!: number;

  @Field(() => Int)
  pageSize!: number;

  @Field()
  hasNextPage!: boolean;
}
