import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Showtime, ShowtimeSchema } from './entities/showtime.entity';
import { ShowtimeController } from './showtimes.controller';
import { ShowtimeService } from './showtimes.service';
import { UserModule } from 'src/users/users.module';
import { ClsModule } from 'nestjs-cls';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Showtime.name, schema: ShowtimeSchema },
    ]),
    UserModule,
    ClsModule,
  ],
  controllers: [ShowtimeController],
  providers: [ShowtimeService],
  exports: [ShowtimeService],
})
export class ShowtimeModule {}
