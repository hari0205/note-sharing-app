import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  Res,
  UseFilters,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { BadRequestExceptionFilter } from './filters/bad-request.filter';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('signup')
  @UseFilters(new BadRequestExceptionFilter())
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.createUser(createUserDto);
    this.logger.debug('User: ', JSON.stringify(user));
    if (user) {
      return {
        username: user.username,
        status: 'User created successfully',
      };
    }
  }

  @Post('login')
  @UseFilters(new BadRequestExceptionFilter())
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.login(loginDto);
    this.logger.debug('Received token', token);
    if (!token) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    res.cookie('authorization', token, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    });
    return {
      statusCode: HttpStatus.OK,
      message: 'Login successful!',
      token: token,
    };
  }
}
