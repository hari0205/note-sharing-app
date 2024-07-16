import { CreateUser } from '../interface/create-user';
import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class CreateUserDto implements CreateUser {


  @IsString()
  username: string;

  @IsString()
  password: string;
}
