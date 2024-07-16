import { ICreateUser } from '../interface/create-user';
import { IsString } from 'class-validator';

export class CreateUserDto implements ICreateUser {
  @IsString()
  username: string;

  @IsString()
  password: string;
}
