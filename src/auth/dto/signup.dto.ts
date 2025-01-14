import {
  IsNotEmpty,
  IsEmail,
  MinLength,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { UserType, Gender } from 'src/Types/users.types';
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

  @ApiProperty({
    description: 'The gender of the user',
    enum: Gender,
    example: Gender.MALE,
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({
    description: 'The address of the user',
    example: '123 Main St, City, Country',
    required: true,
  })
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    description: 'The profile image URL of the user',
    example: 'https://example.com/profile.jpg',
    required: false,
  })
  @IsOptional()
  profileImage?: string;

  @IsOptional()
  userType: UserType = UserType.CLIENT;
}
