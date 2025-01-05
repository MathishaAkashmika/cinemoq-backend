import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MoviesService } from './movies.service';
import { MovieController } from './movies.controller';
import { Movie, MovieSchema } from './entities/movie.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Movie.name, schema: MovieSchema }]),
  ],
  controllers: [MovieController],
  providers: [MoviesService],
  exports: [MoviesService],
})
export class MoviesModule {}
