import { HttpException, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwt: JwtService,
  ) {}

  async login({ username, password }: { username: string; password: string }) {
    const user = await this.userService.findUserByUserName(username);
    if (user) {
      if (await bcrypt.compare(password, user.password)) {
        const payload = { username: user.username };
        return this.jwt.signAsync(payload);
      }

      throw new HttpException(`Bad Username or Password`, 400);
    }

    return null;
  }
}
