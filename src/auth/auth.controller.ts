import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';
import { SignupDto } from './dto/signup.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AppClsStore, UserType, UserResponse } from 'src/Types/users.types';
import { ClsService } from 'nestjs-cls';
import { S3Service } from '../s3/s3.service';
import { BucketDomains } from 'src/Types/s3.types';

@Controller({ path: 'auth', version: '1' })
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly clsService: ClsService,
    private readonly usersService: UsersService,
    private readonly s3Service: S3Service,
  ) {}

  @Post('signup')
  async signup(@Body() signupDto: SignupDto): Promise<{ message: string; user: UserResponse }> {
    try {
      const existingUser = await this.usersService.findOne({
        email: signupDto.email,
      });
      if (existingUser) {
        throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
      }

      let profileImageUrl = null;
      if (signupDto.profileImage) {
        const { s3url } = await this.s3Service.generatePresignedUrl({
          fileName: `${signupDto.firstName}-${signupDto.lastName}-profile`,
          domain: BucketDomains.PROFILE_IMAGES,
          contentType: 'image/jpeg',
        }, true);
        profileImageUrl = s3url;
      }

      const user = await this.usersService.create({
        ...signupDto,
        profileImage: profileImageUrl,
      });

      return {
        message: 'User created successfully',
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          type: user.userType,
          gender: user.gender,
          address: user.address,
          profileImage: user.profileImage,
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
  async getProfile(): Promise<UserResponse> {
    const context = this.clsService.get<AppClsStore>();
    if (!context || !context.user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    console.log(context.user);

    const user = await this.usersService.findOne({ _id: context.user.id });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    return {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      type: user.userType,
      gender: user.gender,
      address: user.address,
      profileImage: user.profileImage,
    };
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('admin')
  async admin(): Promise<UserResponse> {
    const context = this.clsService.get<AppClsStore>();
    if (!context || !context.user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    console.log(context.user);

    const user = await this.usersService.findOne({ _id: context.user.id });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    if (user.userType !== UserType.ADMIN) {
      console.log('User is not admin');
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    return {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      type: user.userType,
      gender: user.gender,
      address: user.address,
      profileImage: user.profileImage,
    };
  }
}