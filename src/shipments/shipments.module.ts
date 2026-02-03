import { Module } from '@nestjs/common';
import { ShipmentsResolver } from './shipments.resolver';
import { ShipmentsService } from './shipments.service';

@Module({
  providers: [ShipmentsResolver, ShipmentsService],
})
export class ShipmentsModule {}
