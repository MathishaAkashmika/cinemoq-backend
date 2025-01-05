import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MoviesService } from './movies.service';
import { MovieController } from './movies.controller';
import { Movie, MovieSchema } from './entities/movie.entity';
import { UserModule } from 'src/users/users.module';
import { ClsModule } from 'nestjs-cls';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Movie.name, schema: MovieSchema }]),
    UserModule,
    ClsModule,
  ],
  controllers: [MovieController],
  providers: [MoviesService],
  exports: [MoviesService],
})
export class MoviesModule {}
