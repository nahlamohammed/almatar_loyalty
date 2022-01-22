import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TransfersModule } from './transfers/transfers.module';


@Module({
  imports: [MongooseModule.forRoot('mongodb://127.0.0.1:27017/almatarLoyality'), UsersModule, AuthModule, TransfersModule],
})
export class AppModule {}