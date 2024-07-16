import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(private jwtService: JwtService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();
    const token = req.cookies.authorization as string;

    this.logger.debug(token);

    if (!token) {
      throw new UnauthorizedException('Unauthorized to access this service');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET ? process.env.JWT_SECRET : 'jwt-secret',
      });

      this.logger.debug('Token: ' + JSON.stringify(payload));
      req['user'] = payload;
    } catch {
      this.logger.error('User ', req.ip);
      throw new UnauthorizedException();
    }
    return true;
  }
}
