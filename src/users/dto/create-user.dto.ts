import { IsEmail, IsNotEmpty, IsEnum } from 'class-validator';
import { UserType } from 'src/Types/users.types';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsNotEmpty()
  @ApiProperty({ description: 'The First of the user' })
  firstName: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'The Last of the user' })
  lastName: string;

  @IsEmail()
  @ApiProperty({ description: 'The email of the user' })
  email: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'The password of the user' })
  password: string;

  @IsEnum(UserType)
  @ApiProperty({ description: 'The role of the user', enum: UserType })
  userType: UserType;
}
