import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../user.entity';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsEnum(['admin', 'agent', 'user'])
  @IsOptional()
  role?: UserRole;
}
