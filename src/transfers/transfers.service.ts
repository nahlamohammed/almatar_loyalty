import * as dayjs from 'dayjs';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import { UsersService } from '../users/users.service';
import { TransferDto } from './dto/transfer.dto';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Transfer, TransferDocument } from './schemas/transfer.schema';
import { ERROR_MESSAGES as USER_ERROR_MESSAGES } from '../users/constants/users.constants';
import { ERROR_MESSAGES as TRANSFER_ERROR_MESSAGES } from './constants/transfers.constants';
import { Injectable, ConflictException, NotFoundException, ForbiddenException, UnauthorizedException } from '@nestjs/common';


@Injectable()
export class TransfersService {
  constructor(@InjectModel(Transfer.name) private transferModel: Model<TransferDocument>,
              private usersService: UsersService,
              @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  async createTransfer(fromUserId: string, toUserId: string, points: number): Promise<Transfer> {
    const expirationDate =  dayjs().add(10, 'minute');
    const transfer = new this.transferModel({from_user: fromUserId, to_user: toUserId, points, expiration_date: expirationDate});
    return transfer.save();
  }


  async checkValidNotConfirmedTransferExists(fromUserId: string): Promise<any> {
    const currentDate =  dayjs();
    const notConfirmedtransfer = await this.transferModel.findOne({from_user: fromUserId, is_confirmed: false, expiration_date: { $gte: currentDate }});
    if(notConfirmedtransfer){
      return true;
    }
    return false;
  }


  async transferPoints(transferDto: TransferDto, loggedInUserId: string): Promise<any> {
    const loggedInUser = await this.usersService.getUserById(loggedInUserId);
    if(loggedInUser.email === transferDto.to_user_email){
      //request conflicts with the current state of the server.
      throw new ConflictException(USER_ERROR_MESSAGES.TRANSFER_NOT_ALLOWED);
    }

    //check the target user exists or not
    const toUser = await this.usersService.getUserByEmail(transferDto.to_user_email);
    if (!toUser) {
      throw new NotFoundException(USER_ERROR_MESSAGES.USER_NOT_FOUND);
    }

    //validate user points balance
    if(transferDto.points > loggedInUser.points){
      throw new ConflictException(USER_ERROR_MESSAGES.POINTS_BALANCE_NOT_ENOUGH);
    }

    // Assumption: no overlapped transfers can be done. 
    // The first transfer must be completely done either by confirmation
    // or by expiration in order to be able to make the second transfer
    const notConfirmedTransferExists = await this.checkValidNotConfirmedTransferExists(loggedInUser._id);
    if(notConfirmedTransferExists){
      //request conflicts with the current state of the server.
      throw new ConflictException(TRANSFER_ERROR_MESSAGES.NOT_CONFIRMED_TRANSFER_FOUND);
    }

    const transfer = await this.createTransfer(loggedInUser._id, toUser._id, transferDto.points);
    return transfer;
  }


  async confirmTransfer(transferId: string, userId:string): Promise<boolean> {
    const transfer = await this.transferModel.findOne({_id : transferId});
    //check transfer exists or not
    if(!transfer){
      throw new NotFoundException(TRANSFER_ERROR_MESSAGES.TRANSFER_NOT_FOUND);
    }

    //check transfer belongs to this user or not
    if(userId !== transfer.from_user.toString()){
      throw new ForbiddenException(TRANSFER_ERROR_MESSAGES.TRANSFER_DOES_NOT_BELONG_TO_USER);
    }

    //check transfer confired before or not
    if(transfer.is_confirmed){
      throw new ForbiddenException(TRANSFER_ERROR_MESSAGES.TRANSFER_IS_CONFIRMED);
    }

    //check transfer is expired or not
    const currentDate = dayjs();
    const transferIsExpired = dayjs(transfer.expiration_date).isBefore(currentDate);
    if(transferIsExpired){
      throw new ConflictException(TRANSFER_ERROR_MESSAGES.TRANSFER_IS_EXPIRED);
    }
    
    //confirm the transfer
    const session = await this.connection.startSession();
    await session.withTransaction(async () => {
        //confirm transfer
        transfer.is_confirmed = true;
        await transfer.save();
        //subtract points from user
        const fromUser = await this.usersService.getUserById(userId);
        fromUser.points = Number(fromUser.points) - Number(transfer.points);
        await fromUser.save();
        //add points to target user
        const toUser = await this.usersService.getUserById(transfer.to_user.toString());
        toUser.points = Number(toUser.points) + Number(transfer.points);
        await toUser.save();
    });
   
    session.endSession();
    return true;

  }
  
  async getUserTransfers(fromUserId: string, loggedInUserId: string): Promise<any> {
    if(fromUserId !== loggedInUserId){
      throw new UnauthorizedException(USER_ERROR_MESSAGES.UNAUTHORIZED_ACCESS);
    }
    return await this.transferModel.find({from_user: fromUserId});
  }

}