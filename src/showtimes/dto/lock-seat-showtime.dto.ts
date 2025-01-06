import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

export class LockSeatShowtimeDto {
  @ApiProperty({
    description: 'Row of the seat to lock',
    example: 5,
  })
  @IsNotEmpty()
  @IsNumber()
  row: number;

  @ApiProperty({
    description: 'Column of the seat to lock',
    example: 5,
  })
  @IsNotEmpty()
  @IsNumber()
  col: number;
}
