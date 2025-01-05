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

@ApiTags('movie')
@Controller({ path: 'movie', version: '1' })
export class MovieController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @ApiOperation({ summary: 'Create movie' })
  create(@Body() createMovieDto: CreateMovieDto) {
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
  update(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto) {
    return this.moviesService.update(id, updateMovieDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @ApiOperation({ summary: 'Delete movie' })
  remove(@Param('id') id: string) {
    return this.moviesService.remove(id);
  }
}
