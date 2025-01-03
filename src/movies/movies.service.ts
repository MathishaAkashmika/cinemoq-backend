import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie, MovieDocument } from './entities/movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { FileStorageService } from '../file-storage/file-storage.service';

@Injectable()
export class MoviesService {
  constructor(
    @InjectModel(Movie.name) private movieModel: Model<MovieDocument>,
    private readonly fileStorageService: FileStorageService,
  ) {}

  private transformMovieResponse(movie: MovieDocument) {
    const responseMovie = movie.toObject();

    // Get the appropriate image name based on is_thumbnail flag
    const imagePath = responseMovie.is_thumbnail
      ? responseMovie.thumbnailImage
      : responseMovie.bannerImage;
    const imageName = imagePath ? imagePath.split('/').pop() : null;

    return {
      _id: responseMovie._id,
      name: responseMovie.name,
      description: responseMovie.description,
      is_thumbnail: responseMovie.is_thumbnail,
      image: imageName,
      createdAt: responseMovie.createdAt,
      updatedAt: responseMovie.updatedAt,
    };
  }

  async create(createMovieDto: CreateMovieDto): Promise<any> {
    const {
      name,
      description,
      thumbnailImage,
      bannerImage,
      is_thumbnail = true,
    } = createMovieDto;

    // Save thumbnail image
    const thumbnailPath = await this.fileStorageService.saveBase64Image(
      thumbnailImage,
      `movies/thumbnails`,
    );

    // Save banner image
    const bannerPath = await this.fileStorageService.saveBase64Image(
      bannerImage,
      `movies/banners`,
    );

    // Create and save the movie
    const movie = new this.movieModel({
      name,
      description,
      thumbnailImage: thumbnailPath,
      bannerImage: bannerPath,
      is_thumbnail,
    });

    const savedMovie = await movie.save();
    return this.transformMovieResponse(savedMovie);
  }

  async findAll(): Promise<any[]> {
    const movies = await this.movieModel.find().exec();
    return movies.map((movie) => this.transformMovieResponse(movie));
  }

  async findOne(id: string): Promise<any> {
    const movie = await this.movieModel.findById(id).exec();
    if (!movie) {
      throw new HttpException('Movie not found', HttpStatus.NOT_FOUND);
    }
    return this.transformMovieResponse(movie);
  }

  async update(id: string, updateMovieDto: UpdateMovieDto): Promise<any> {
    const movie = await this.movieModel.findById(id).exec();
    if (!movie) {
      throw new HttpException('Movie not found', HttpStatus.NOT_FOUND);
    }

    const { name, description, thumbnailImage, bannerImage, is_thumbnail } =
      updateMovieDto;

    // Update basic info if provided
    if (name) movie.name = name;
    if (description) movie.description = description;
    if (typeof is_thumbnail === 'boolean') movie.is_thumbnail = is_thumbnail;

    // Update thumbnail if provided
    if (thumbnailImage) {
      // Delete old thumbnail
      await this.fileStorageService.deleteFile(movie.thumbnailImage);
      // Save new thumbnail
      const newThumbnailPath = await this.fileStorageService.saveBase64Image(
        thumbnailImage,
        `movies/thumbnails`,
      );
      movie.thumbnailImage = newThumbnailPath;
    }

    // Update banner if provided
    if (bannerImage) {
      // Delete old banner
      await this.fileStorageService.deleteFile(movie.bannerImage);
      // Save new banner
      const newBannerPath = await this.fileStorageService.saveBase64Image(
        bannerImage,
        `movies/banners`,
      );
      movie.bannerImage = newBannerPath;
    }

    await movie.save();
    return this.transformMovieResponse(movie);
  }

  async remove(id: string): Promise<any> {
    const movie = await this.movieModel.findById(id).exec();
    if (!movie) {
      throw new HttpException('Movie not found', HttpStatus.NOT_FOUND);
    }

    // Delete both images
    await this.fileStorageService.deleteFile(movie.thumbnailImage);
    await this.fileStorageService.deleteFile(movie.bannerImage);

    // Delete the movie
    await this.movieModel.findByIdAndDelete(id);

    return this.transformMovieResponse(movie);
  }
}
