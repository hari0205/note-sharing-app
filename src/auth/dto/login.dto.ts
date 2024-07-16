import { IsNotEmpty, IsString } from 'class-validator';
import { ILogin } from '../interface/login';

export class LoginDto implements ILogin {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
