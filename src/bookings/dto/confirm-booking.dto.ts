import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsString } from 'class-validator';

export class ConfirmBookingDto {
  @ApiProperty({ required: true })
  @IsString()
  orderId: string;
}
