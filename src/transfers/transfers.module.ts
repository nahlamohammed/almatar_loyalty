import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/users.module';
import { TransfersService } from './transfers.service';
import { TransfersController } from './transfers.controller';
import { Transfer, TransferSchema } from './schemas/transfer.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Transfer.name, schema: TransferSchema }]), UsersModule],
  controllers: [TransfersController],
  providers: [TransfersService],
})
export class TransfersModule {}