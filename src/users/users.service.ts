import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { UserDto } from './dto/user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { USER_CONSTANTS, ERROR_MESSAGES } from './constants/users.constants';
import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>) {}

    
  async createUser(userDto: UserDto): Promise<User> {
    const { name, email, password  } = userDto;

    //check user exists or not by email
    const existedUser = await this.getUserByEmail(email);
    if (existedUser) {
      //request conflicts with the current state of the server.
      throw new ConflictException(ERROR_MESSAGES.EMAIL_EXISTS);
    }
    //create a hashed password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    //create the user
    const user = new this.userModel({ name, email, password: hashedPassword, points: USER_CONSTANTS.GIFT_POINTS });
    return user.save();
  }

  async getUserByEmail(email: string): Promise<User|any> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      return null;
    }
    return user;
  }

  async getUserById(id: string): Promise<User|any> {
    const user = await this.userModel.findOne({ _id: id });
    //check if user is found or not
    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    }
    return user;
  }

}