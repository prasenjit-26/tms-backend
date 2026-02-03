import { Field, GraphQLISODateTime, InputType, Int } from '@nestjs/graphql';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { ShipmentStatus } from './shipment.enums';

export enum ShipmentSortField {
  pickupDate = 'pickupDate',
  updatedAt = 'updatedAt',
  shipperName = 'shipperName',
  carrierName = 'carrierName',
  status = 'status',
}

export enum SortDirection {
  asc = 'asc',
  desc = 'desc',
}

@InputType()
export class ShipmentSortInput {
  @Field(() => String)
  @IsEnum(ShipmentSortField)
  field!: ShipmentSortField;

  @Field(() => String)
  @IsEnum(SortDirection)
  direction!: SortDirection;
}

@InputType()
export class ShipmentFilterInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  q?: string;

  @Field(() => ShipmentStatus, { nullable: true })
  @IsOptional()
  @IsEnum(ShipmentStatus)
  status?: ShipmentStatus;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  flagged?: boolean;
}

@InputType()
export class PaginationInput {
  @Field(() => Int)
  @IsInt()
  @Min(1)
  page!: number;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  pageSize!: number;
}

@InputType()
export class CreateShipmentInput {
  @Field()
  @IsString()
  @MinLength(3)
  referenceNumber!: string;

  @Field()
  @IsString()
  shipperName!: string;

  @Field()
  @IsString()
  carrierName!: string;

  @Field()
  @IsString()
  pickupLocation!: string;

  @Field()
  @IsString()
  deliveryLocation!: string;

  @Field(() => GraphQLISODateTime)
  pickupDate!: Date;

  @Field(() => ShipmentStatus)
  @IsEnum(ShipmentStatus)
  status!: ShipmentStatus;

  @Field(() => Int)
  @IsInt()
  @Min(0)
  rateCents!: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  currency?: string;
}

@InputType()
export class UpdateShipmentInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  shipperName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  carrierName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  pickupLocation?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  deliveryLocation?: string;

  @Field(() => ShipmentStatus, { nullable: true })
  @IsOptional()
  @IsEnum(ShipmentStatus)
  status?: ShipmentStatus;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  rateCents?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  currency?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  flagged?: boolean;
}
