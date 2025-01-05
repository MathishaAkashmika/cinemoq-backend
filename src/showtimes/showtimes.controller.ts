import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';
import { ShowtimeService } from './showtimes.service';
import { AuthGuard } from '@nestjs/passport';
import { AppClsStore, UserType } from 'src/Types/users.types';
import { UsersService } from 'src/users/users.service';
import { ClsService } from 'nestjs-cls';

@ApiTags('showtimes')
@Controller({ path: 'showtimes', version: '1' })
export class ShowtimeController {
  constructor(
    private readonly showtimeService: ShowtimeService,
    private readonly clsService: ClsService,
    private readonly usersService: UsersService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiOperation({ summary: 'Create a new showtime' })
  @ApiResponse({ status: 201, description: 'The showtime has been created' })
  async create(@Body() createShowtimeDto: CreateShowtimeDto) {
    const context = this.clsService.get<AppClsStore>();
    if (!context || !context.user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    const user = await this.usersService.findOne({ _id: context.user.id });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    if (user.userType !== UserType.ADMIN) {
      console.log('User is not admin');
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    return this.showtimeService.create(createShowtimeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all showtimes' })
  findAll(@Query() query: any) {
    return this.showtimeService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a showtime by id' })
  findOne(@Param('id') id: string) {
    return this.showtimeService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  @ApiOperation({ summary: 'Update a showtime' })
  async update(
    @Param('id') id: string,
    @Body() updateShowtimeDto: UpdateShowtimeDto,
  ) {
    const context = this.clsService.get<AppClsStore>();
    if (!context || !context.user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    const user = await this.usersService.findOne({ _id: context.user.id });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    if (user.userType !== UserType.ADMIN) {
      console.log('User is not admin');
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    return this.showtimeService.update(id, updateShowtimeDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a showtime' })
  async remove(@Param('id') id: string) {
    const context = this.clsService.get<AppClsStore>();
    if (!context || !context.user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    const user = await this.usersService.findOne({ _id: context.user.id });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    if (user.userType !== UserType.ADMIN) {
      console.log('User is not admin');
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    return this.showtimeService.remove(id);
  }
}
