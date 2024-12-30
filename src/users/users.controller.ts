import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ClsService } from 'nestjs-cls';
import { UsersService } from './users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AppClsStore } from 'src/Types/users.types';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';

@ApiTags('user')
@Controller({ path: 'user', version: '1' })
export class UserController {
  constructor(
    private readonly userService: UsersService,
    private readonly clsService: ClsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create user' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch('/profile')
  @ApiOperation({ summary: 'Update user profile' })
  updateProfile(@Body() updateUserDto: UpdateUserDto) {
    const context = this.clsService.get<AppClsStore>();
    if (!context || !context.user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    return this.userService.update(context.user.id, updateUserDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne({ _id: id });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
