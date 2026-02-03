/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateShipmentInput,
  ShipmentFilterInput,
  ShipmentSortField,
  ShipmentSortInput,
  SortDirection,
  UpdateShipmentInput,
} from './shipment.inputs';

@Injectable()
export class ShipmentsService {
  constructor(private readonly prisma: PrismaService) {}

  private buildWhere(filter?: ShipmentFilterInput) {
    const where: any = {};

    if (!filter) return where;

    if (filter.status) {
      where.status = filter.status as any;
    }

    if (typeof filter.flagged === 'boolean') {
      where.flagged = filter.flagged;
    }

    if (filter.q && filter.q.trim().length > 0) {
      const q = filter.q.trim();
      where.OR = [
        { referenceNumber: { contains: q, mode: 'insensitive' } },
        { shipperName: { contains: q, mode: 'insensitive' } },
        { carrierName: { contains: q, mode: 'insensitive' } },
        { pickupLocation: { contains: q, mode: 'insensitive' } },
        { deliveryLocation: { contains: q, mode: 'insensitive' } },
      ];
    }

    return where;
  }

  private buildOrderBy(sort?: ShipmentSortInput) {
    const direction = sort?.direction === SortDirection.asc ? 'asc' : 'desc';

    const field = sort?.field ?? ShipmentSortField.updatedAt;

    switch (field) {
      case ShipmentSortField.pickupDate:
        return { pickupDate: direction };
      case ShipmentSortField.shipperName:
        return { shipperName: direction };
      case ShipmentSortField.carrierName:
        return { carrierName: direction };
      case ShipmentSortField.status:
        return { status: direction };
      case ShipmentSortField.updatedAt:
      default:
        return { updatedAt: direction };
    }
  }

  async list(params: {
    filter?: ShipmentFilterInput;
    page: number;
    pageSize: number;
    sort?: ShipmentSortInput;
  }) {
    const where = this.buildWhere(params.filter);
    const orderBy = this.buildOrderBy(params.sort);

    const skip = (params.page - 1) * params.pageSize;
    const take = params.pageSize;

    const [totalCount, nodes] = await this.prisma.$transaction([
      this.prisma.shipment.count({ where }),
      this.prisma.shipment.findMany({
        where,
        orderBy: orderBy as any,
        skip,
        take,
        include: {
          trackingEvents: {
            orderBy: { occurredAt: 'desc' },
          },
        },
      }),
    ]);

    const hasNextPage = skip + nodes.length < totalCount;

    return {
      nodes,
      totalCount,
      page: params.page,
      pageSize: params.pageSize,
      hasNextPage,
    };
  }

  async getById(id: string) {
    const shipment = await this.prisma.shipment.findUnique({
      where: { id },
      include: {
        trackingEvents: {
          orderBy: { occurredAt: 'desc' },
        },
      },
    });

    if (!shipment) throw new NotFoundException('Shipment not found');

    return shipment;
  }

  async create(input: CreateShipmentInput) {
    return this.prisma.shipment.create({
      data: {
        referenceNumber: input.referenceNumber,
        shipperName: input.shipperName,
        carrierName: input.carrierName,
        pickupLocation: input.pickupLocation,
        deliveryLocation: input.deliveryLocation,
        pickupDate: input.pickupDate,
        status: input.status as any,
        rateCents: input.rateCents,
        currency: input.currency ?? 'USD',
      },
      include: {
        trackingEvents: {
          orderBy: { occurredAt: 'desc' },
        },
      },
    });
  }

  async update(id: string, input: UpdateShipmentInput) {
    await this.getById(id);

    return this.prisma.shipment.update({
      where: { id },
      data: {
        shipperName: input.shipperName ?? undefined,
        carrierName: input.carrierName ?? undefined,
        pickupLocation: input.pickupLocation ?? undefined,
        deliveryLocation: input.deliveryLocation ?? undefined,
        status: input.status ? (input.status as any) : undefined,
        rateCents:
          typeof input.rateCents === 'number' ? input.rateCents : undefined,
        currency: input.currency ?? undefined,
        flagged: typeof input.flagged === 'boolean' ? input.flagged : undefined,
      },
      include: {
        trackingEvents: {
          orderBy: { occurredAt: 'desc' },
        },
      },
    });
  }

  async flag(id: string, flagged: boolean) {
    await this.getById(id);

    return this.prisma.shipment.update({
      where: { id },
      data: { flagged },
      include: {
        trackingEvents: {
          orderBy: { occurredAt: 'desc' },
        },
      },
    });
  }

  async remove(id: string) {
    await this.getById(id);
    await this.prisma.shipment.delete({ where: { id } });
    return true;
  }
}
