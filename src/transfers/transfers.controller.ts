import { TransferDto } from './dto/transfer.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TransfersService } from './transfers.service';
import { ParamsDto as TransferParamsDto }  from './dto/params.dto';
import { ParamsDto as UserParamsDto }  from '../users/dto/params.dto';
import { Body, Controller, Post, Get, Param, UseGuards, Request } from '@nestjs/common';

@Controller('users/:userId/transfers')
export class TransfersController {
    constructor(private readonly transfersService: TransfersService
      ) {}


    @UseGuards(JwtAuthGuard)
    @Post()
    async createTransfer(@Body() transferDto: TransferDto, @Request() request) {
      return await this.transfersService.transferPoints(transferDto, request.user.userId);
    }


    @UseGuards(JwtAuthGuard)
    @Post(':transferId/actions/confirm')
    async confirmTransfer(@Param() params: TransferParamsDto, @Request() request) {
      return await this.transfersService.confirmTransfer(params.transferId, request.user.userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getUserTransfers(@Param() params: UserParamsDto, @Request() request) {
      return await this.transfersService.getUserTransfers(params.userId, request.user.userId);
    }
    
}