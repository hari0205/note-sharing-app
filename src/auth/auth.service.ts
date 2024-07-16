import { HttpException, Injectable, Logger } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly jwt: JwtService,
  ) {}

  async login({ username, password }: { username: string; password: string }) {
    const user = await this.userService.findUserByUserName(username);
    this.logger.debug(`User after findUser : ${user.username}`);
    if (user) {
      if (await bcrypt.compare(password, user.password)) {
        const payload = { username: user.username };
        const token = await this.jwt.signAsync(payload, { algorithm: 'HS512' });
        this.logger.debug('Token', token);
        return token;
      }

      throw new HttpException(`Bad Username or Password`, 400);
    }

    return null;
  }
}
