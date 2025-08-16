import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
    required: true
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'User full name',
    required: true
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'P@ssw0rd123!',
    description: 'User password (min 8 characters)',
    minLength: 8,
    required: true
  })
  @IsString()
  @MinLength(8)
  password: string;
}