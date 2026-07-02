import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Genre } from './entities/genre.entity';

@Injectable()
export class GenresService {
  constructor(
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
  ) {}

  async create(name: string) {
    return await this.genreRepository.save({ name });
  }

  async findAll() {
    return await this.genreRepository.find();
  }

  async findOne(id: number) {
    return await this.genreRepository.findOne({ where: { id } });
  }

  async update(id: number, name: string) {
    const genre = await this.findOne(id);

    if (!genre) throw new NotFoundException();

    return this.genreRepository.save({ id, name });
  }

  async remove(id: number) {
    const genre = await this.findOne(id);

    if (!genre) throw new NotFoundException();

    return this.genreRepository.delete(id);
  }
}
