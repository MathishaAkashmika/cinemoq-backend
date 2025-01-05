import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  DefaultValuePipe,
  ParseBoolPipe,
  ParseIntPipe,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { AppClsStore, UserType } from 'src/Types/users.types';
import { ClsService } from 'nestjs-cls';
import { UsersService } from 'src/users/users.service';

@ApiTags('movie')
@Controller({ path: 'movie', version: '1' })
export class MovieController {
  constructor(
    private readonly moviesService: MoviesService,
    private readonly clsService: ClsService,
    private readonly usersService: UsersService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiOperation({ summary: 'Create movie' })
  async create(@Body() createMovieDto: CreateMovieDto) {
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
    return this.moviesService.create(createMovieDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get paginated list of movies' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Items per page',
    example: 10,
  })
  @ApiQuery({
    name: 'pagination',
    required: false,
    description: 'Enable pagination',
    example: true,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search term',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    description: 'Sort by field',
    example: 'createdAt:desc',
  })
  @ApiQuery({
    name: 'genre',
    required: false,
    description: 'Filter by genre',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Start date',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'End date',
  })
  async getPaginatedList(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('pagination', new DefaultValuePipe(true), ParseBoolPipe)
    pagination: boolean = true,
    @Query('sortBy', new DefaultValuePipe('createdAt:desc')) sortBy: string,
    @Query('search', new DefaultValuePipe(undefined))
    search: string | undefined,
    @Query('genre') genre?: string,
    @Query('startDate') startDate?: Date,
    @Query('endDate') endDate?: Date,
  ) {
    return this.moviesService.getPaginatedList({
      filter: { search, genre, startDate, endDate },
      options: { page, limit, pagination, sortBy },
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get movie by ID' })
  findOne(@Param('id') id: string) {
    return this.moviesService.findOne({ _id: id });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  @ApiOperation({ summary: 'Update movie' })
  async update(
    @Param('id') id: string,
    @Body() updateMovieDto: UpdateMovieDto,
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
    return this.moviesService.update(id, updateMovieDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @ApiOperation({ summary: 'Delete movie' })
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
    return this.moviesService.remove(id);
  }
}
