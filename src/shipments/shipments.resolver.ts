import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import {
  CreateShipmentInput,
  PaginationInput,
  ShipmentFilterInput,
  ShipmentSortInput,
  UpdateShipmentInput,
} from './shipment.inputs';
import { Shipment, ShipmentConnection } from './shipment.types';
import { ShipmentsService } from './shipments.service';

@Resolver(() => Shipment)
export class ShipmentsResolver {
  constructor(private readonly shipmentsService: ShipmentsService) {}

  @Query(() => ShipmentConnection)
  async shipments(
    @Args('pagination') pagination: PaginationInput,
    @Args('filter', { nullable: true }) filter?: ShipmentFilterInput,
    @Args('sort', { nullable: true }) sort?: ShipmentSortInput,
  ): Promise<ShipmentConnection> {
    return (await this.shipmentsService.list({
      page: pagination.page,
      pageSize: pagination.pageSize,
      filter,
      sort,
    })) as unknown as ShipmentConnection;
  }

  @Query(() => Shipment)
  async shipment(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Shipment> {
    return (await this.shipmentsService.getById(id)) as unknown as Shipment;
  }

  @Roles(Role.admin)
  @Mutation(() => Shipment)
  async addShipment(
    @Args('input') input: CreateShipmentInput,
  ): Promise<Shipment> {
    return (await this.shipmentsService.create(input)) as unknown as Shipment;
  }

  @Roles(Role.admin)
  @Mutation(() => Shipment)
  async updateShipment(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateShipmentInput,
  ): Promise<Shipment> {
    return (await this.shipmentsService.update(
      id,
      input,
    )) as unknown as Shipment;
  }

  @Roles(Role.admin)
  @Mutation(() => Shipment)
  async flagShipment(
    @Args('id', { type: () => ID }) id: string,
    @Args('flagged') flagged: boolean,
  ): Promise<Shipment> {
    return (await this.shipmentsService.flag(
      id,
      flagged,
    )) as unknown as Shipment;
  }

  @Roles(Role.admin)
  @Mutation(() => Boolean)
  async deleteShipment(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    return this.shipmentsService.remove(id);
  }
}
