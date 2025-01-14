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
import { CareersService } from './careers.service';
import { CreateCareerDto } from './dto/create-career.dto';
import { UpdateCareerDto } from './dto/update-career.dto';
import { AppClsStore, UserType } from 'src/Types/users.types';
import { ClsService } from 'nestjs-cls';
import { UsersService } from 'src/users/users.service';

@ApiTags('careers')
@Controller({ path: 'careers', version: '1' })
export class CareersController {
  constructor(
    private readonly careersService: CareersService,
    private readonly clsService: ClsService,
    private readonly usersService: UsersService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiOperation({ summary: 'Create career opportunity' })
  async create(@Body() createCareerDto: CreateCareerDto) {
    const context = this.clsService.get<AppClsStore>();
    if (!context || !context.user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    const user = await this.usersService.findOne({ _id: context.user.id });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    if (user.userType !== UserType.ADMIN) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    return this.careersService.create(createCareerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get paginated list of career opportunities' })
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
    name: 'department',
    required: false,
    description: 'Filter by department',
  })
  async getPaginatedList(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('pagination', new DefaultValuePipe(true), ParseBoolPipe)
    pagination: boolean = true,
    @Query('sortBy', new DefaultValuePipe('createdAt:desc')) sortBy: string,
    @Query('search', new DefaultValuePipe(undefined))
    search: string | undefined,
    @Query('department') department?: string,
  ) {
    return this.careersService.getPaginatedList({
      filter: { search, department },
      options: { page, limit, pagination, sortBy },
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get career opportunity by ID' })
  findOne(@Param('id') id: string) {
    return this.careersService.findOne({ _id: id });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  @ApiOperation({ summary: 'Update career opportunity' })
  async update(
    @Param('id') id: string,
    @Body() updateCareerDto: UpdateCareerDto,
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
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    return this.careersService.update(id, updateCareerDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @ApiOperation({ summary: 'Delete career opportunity' })
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
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    return this.careersService.remove(id);
  }
}
