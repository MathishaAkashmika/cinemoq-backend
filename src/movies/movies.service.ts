import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel, PaginateResult, Types } from 'mongoose';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie, MovieDocument } from './entities/movie.entity';

@Injectable()
export class MoviesService {
  constructor(
    @InjectModel(Movie.name)
    private movieModel: Model<MovieDocument> & PaginateModel<MovieDocument>,
  ) {}

  async create(createMovieDto: CreateMovieDto): Promise<MovieDocument> {
    const createdMovie = new this.movieModel(createMovieDto);
    return createdMovie.save();
  }

  async getPaginatedList({
    filter,
    options,
  }: {
    filter: { [key: string]: any };
    options: { [key: string]: any };
  }): Promise<PaginateResult<Movie>> {
    const queryFilter: any = {};

    // Handle search
    if (filter.search && filter.search.trim() !== '') {
      queryFilter.$or = [
        { name: { $regex: filter.search, $options: 'i' } },
        { description: { $regex: filter.search, $options: 'i' } },
        { genre: { $regex: filter.search, $options: 'i' } },
      ];
    }
    delete filter.search;

    // Handle genre filter
    if (filter.genre) {
      queryFilter.genre = filter.genre;
    }

    // Handle date range filter
    const isValidDate = (date: any) => {
      if (!date) return false;
      const parsedDate = new Date(date);
      return parsedDate instanceof Date && !isNaN(parsedDate.getTime());
    };

    const startDate = isValidDate(filter.startDate)
      ? new Date(filter.startDate)
      : null;
    const endDate = isValidDate(filter.endDate)
      ? new Date(filter.endDate)
      : null;

    if (startDate || endDate) {
      queryFilter.releaseDate = {};

      if (startDate) {
        queryFilter.releaseDate.$gte = startDate;
      }

      if (endDate) {
        queryFilter.releaseDate.$lte = endDate;
      }
    }

    // Handle sorting
    if (options.sortBy) {
      options.sort = this.createSortObject(options.sortBy);
    }
    delete options.sortBy;

    return this.movieModel.paginate(queryFilter, options);
  }

  private createSortObject(sortBy: string): Record<string, 1 | -1> {
    const [field, order] = sortBy.split(':');
    return { [field]: order === 'desc' ? -1 : 1 };
  }

  async findByCategory(categoryId: string): Promise<MovieDocument[]> {
    return this.movieModel.find({categoryId: new Types.ObjectId(categoryId)}).exec();
  }

  async findOne(query: any): Promise<MovieDocument | null> {
    return this.movieModel.findOne(query).exec();
  }

  async update(
    id: string,
    updateMovieDto: UpdateMovieDto,
  ): Promise<MovieDocument | null> {
    const movie = await this.movieModel.findById(id).exec();
    if (!movie) {
      throw new HttpException('Movie not found', HttpStatus.BAD_REQUEST);
    }
    return this.movieModel
      .findByIdAndUpdate(id, updateMovieDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<MovieDocument | null> {
    return this.movieModel.findByIdAndDelete(id).exec();
  }
}
