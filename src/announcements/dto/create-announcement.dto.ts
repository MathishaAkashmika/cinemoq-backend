import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsDate, IsString, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAnnouncementDto {
  @ApiProperty({
    description: 'The name of the announcement',
    example: 'Special Holiday Screening',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Announcement description',
    example:
      'Join us for a special holiday screening event with exclusive movies and offers!',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Start date of the announcement',
    example: '2024-01-01T00:00:00.000Z',
  })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({
    description: 'End date of the announcement',
    example: '2024-01-31T23:59:59.000Z',
  })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  @ValidateIf((o) => o.startDate && o.endDate && o.endDate > o.startDate, {
    message: 'End date must be after start date',
  })
  endDate: Date;
}
