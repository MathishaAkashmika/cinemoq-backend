import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsDate,
  IsNumber,
  IsString,
  IsBoolean,
  IsOptional,
  Min,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';

class SeatLayout {
  @ApiProperty({
	description: 'Row of seat',
	example: 5,
  })
  rows: number;

  @ApiProperty({
	description: 'Column of seat',
	example: 6,
  })
  cols: number;
}

export class CreateShowtimeDto {
  @ApiProperty({
    description: 'Movie ID reference',
    example: '507f1f77bcf86cd799439011',
  })
  @IsNotEmpty()
  @IsMongoId()
  movieId: string;

  @ApiProperty({
    description: 'Start time of the show',
    example: '2024-01-05T18:00:00.000Z',
  })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  startTime: Date;

  @ApiProperty({
    description: 'End time of the show',
    example: '2024-01-05T20:30:00.000Z',
  })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  endTime: Date;

  @ApiProperty({
    description: 'Total number of seats',
    example: 100,
    minimum: 0,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  totalSeats: number;

  @ApiProperty({
    description: 'Price for the show',
    example: 15.99,
    minimum: 0,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'Screen or theater number',
    example: 1,
  })
  @IsNotEmpty()
  @IsString()
  screenNo: number;

  @ApiPropertyOptional({
    description: 'Seat layout configuration',
    example: { rows: 10, columns: 10 },
  })
  @Type(() => SeatLayout)
  @IsOptional()
  seatLayout?: SeatLayout;
}
