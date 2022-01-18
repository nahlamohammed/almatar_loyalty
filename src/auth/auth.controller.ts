import { Controller, Body, Post, UseGuards, Request, Get } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '../auth/local-auth.guard';


@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService
    ) {}


    @UseGuards(LocalAuthGuard)
    @Post('auth/login')
    async login(@Request() req) {
      // Passport automatically creates a user object, 
      //based on the value we return from the validate() method, 
      // and assigns it to the Request object as req.user. 
      return this.authService.login(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    getMe(@Request() req) {
      return req.user;
    }
}