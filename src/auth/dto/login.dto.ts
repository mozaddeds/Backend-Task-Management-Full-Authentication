import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class LoginDto {
  @ApiProperty({ example: 'user@example.com', required: true })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'P@ssw0rd123!', required: true })
  @IsString()
  password: string;
}