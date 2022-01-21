import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';
import { ParamsDto } from './dto/params.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Body, Controller, Post, Get, Param, UseGuards } from '@nestjs/common';


@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    async createUser(@Body() userDto: UserDto) {
      return await this.usersService.createUser(userDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':userId')
    async getUser(@Param() params: ParamsDto) {
      return await this.usersService.getUserById(params.userId);
    }
}