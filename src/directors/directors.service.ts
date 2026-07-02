import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Director } from './entities/director.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DirectorsService {
  constructor(
    @InjectRepository(Director)
    private readonly directorRepository: Repository<Director>,
  ) {}

  async create(name: string, dob: Date, nationality: string) {
    return await this.directorRepository.save({
      name,
      dob,
      nationality,
    });
  }

  async findAll() {
    return await this.directorRepository.find();
  }

  async findOne(id: number) {
    return await this.directorRepository.findOne({ where: { id } });
  }

  async update(id: number, name?: string, dob?: Date, nationality?: string) {
    const director = await this.directorRepository.findOne({ where: { id } });

    if (!director) throw new NotFoundException();

    await this.directorRepository.update(id, {
      name: name ?? director.name,
      dob: dob ?? director.dob,
      nationality: nationality ?? director.nationality,
    });

    return await this.directorRepository.findOne({ where: { id } });
  }

  async remove(id: number) {
    return await this.directorRepository.delete(id);
  }
}
