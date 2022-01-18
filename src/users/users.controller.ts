import { Body, Controller, Post, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { FindOneParams } from './dto/find-one-params';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';


@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService
      ) {}

    @Post()
    async createUser(@Body() userDto: UserDto) {
      return await this.usersService.createUser(userDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async findOne(@Param() params: FindOneParams) {
      return await this.usersService.getUserById(params.id);
    }
    
}
