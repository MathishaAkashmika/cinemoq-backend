import { IsNotEmpty, IsEmail, MinLength, IsOptional } from 'class-validator';
import { UserType } from 'src/Types/users.types';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
  @ApiProperty({
    description: 'The first name of the user',
    example: 'John',
    required: true,
  })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'The last name of the user',
    example: 'Doe',
    required: true,
  })
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'john.doe@example.com',
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password for the account (minimum 6 characters)',
    example: 'password123',
    minimum: 6,
    required: true,
  })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsOptional()
  userType: UserType = UserType.CLIENT;
}
