import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(email: string, password: string): Promise<User> {
    const user = this.userRepository.create({
      email,
      password,
    });

    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async update(id: number, password: string) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    user.password = password;

    return await this.userRepository.save(user);
  }

  async remove(id: number) {
    return await this.userRepository.delete(id);
  }
}
