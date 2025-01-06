import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsString } from 'class-validator';

export class ConfirmBookingDto {
  @ApiProperty({ required: true })
  @IsString()
  merchant_id: string;

  @ApiProperty({ required: true })
  @IsString()
  order_id: string;

  @ApiProperty({ required: true })
  @IsString()
  payment_id: string;

  @ApiProperty({ required: true })
  @IsNumberString()
  payhere_amount: string;

  @ApiProperty({ required: true })
  @IsString()
  payhere_currency: string;

  @ApiProperty({ required: true })
  @IsNumberString()
  status_code: string;

  @ApiProperty({ required: true })
  @IsString()
  md5sig: string;

  @ApiProperty({ required: true })
  @IsString()
  custom_1: string;

  @ApiProperty({ required: true })
  @IsString()
  custom_2: string;

  @ApiProperty({ required: true })
  @IsString()
  method: string;

  @ApiProperty({ required: true })
  @IsString()
  status_message: string;

  @ApiProperty({ required: false })
  @IsString()
  card_holder_name: string;

  @ApiProperty({ required: false })
  @IsString()
  card_no: string;

  @ApiProperty({ required: false })
  @IsString()
  card_expiry: string;
}
