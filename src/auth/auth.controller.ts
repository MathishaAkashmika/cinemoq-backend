import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Request,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';
import { SignupDto } from './dto/signup.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AppClsStore } from 'src/Types/users.types';
import { ClsService } from 'nestjs-cls';

@Controller({ path: 'auth', version: '1' })
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly clsService: ClsService,
    private readonly usersService: UsersService,
  ) {}

  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    try {
      const existingUser = await this.usersService.findOne({
        email: signupDto.email,
      });
      if (existingUser) {
        throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
      }

      const user = await this.usersService.create(signupDto);
      return {
        message: 'User created successfully',
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          type: user.userType,
        },
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Something went wrong',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    return this.authService.login(user);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  async getProfile() {
    const context = this.clsService.get<AppClsStore>();
    if (!context || !context.user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    console.log(context.user);
    const user = await this.usersService.findOne({ _id: context.user.id });
    return {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      type: user.userType,
    };
  }
}
