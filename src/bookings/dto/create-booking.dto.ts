import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsMongoId,
  IsArray,
  ArrayNotEmpty,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

class Seat {
  @ApiProperty({
    description: 'Row of the seat',
    example: 4,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  row: number;

  @ApiProperty({
    description: 'Col of the seat',
    example: 4,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  col: number;
}

export class CreateBookingDto {
  @ApiProperty({
    description: 'Showtime ID reference',
    example: '507f1f77bcf86cd799439011',
  })
  @IsNotEmpty()
  @IsMongoId()
  showtimeId: string;

  @ApiProperty({
    description: 'Seats',
    example: [{row: 5, col: 4}],
  })
  @Type(() => Seat)
  @IsArray()
  @ArrayNotEmpty()
  seats: Seat[];
}
