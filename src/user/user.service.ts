import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async createUser(createdto: CreateUserDto): Promise<User> {
    const username = createdto.username;
    const user = await this.userRepository.findOneBy({ username });

    if (user) {
      this.logger.error('User already exists. Cannot create new user');

      throw new BadRequestException(`User with ${username} already exists`, {
        cause: new Error(),
        description: 'User Already Exists',
      });
    }
    const new_user = this.userRepository.create(createdto);
    await this.userRepository.save(new_user).catch((err) => console.error(err));
    return new_user;
  }

  async findUserByUserName(username: string): Promise<User> {
    if (!username) return null;
    const user = await this.userRepository.findOneBy({ username });
    if (!user)
      throw new NotFoundException(`User with ${username} not found`, {
        cause: new Error(),
        description: 'User not found',
      });
    return user;
  }
}
