import { ILogin } from '../interface/login';

export class LoginDto implements ILogin {
  username!: string;

  password!: string;
}
