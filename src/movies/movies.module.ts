import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { Movie, MovieSchema } from './entities/movie.entity';
import { FileStorageModule } from '../file-storage/file-storage.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Movie.name, schema: MovieSchema }]),
    FileStorageModule,
  ],
  controllers: [MoviesController],
  providers: [MoviesService],
  exports: [MoviesService],
})
export class MoviesModule {}
