import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { TransfersModule } from './transfers/transfers.module';


@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  })
    , MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: `mongodb://${configService.get('DB_USER')}:${configService.get('DB_PASS')}@${configService.get('DB_URI')}:${configService.get('DB_PORT')}/${configService.get('DB_NAME')}`,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule, TransfersModule],
})
export class AppModule { }