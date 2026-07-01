import { Injectable, NotFoundException } from '@nestjs/common';
import { Movie } from './entities/movie.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}

  async getManyMovies(title?: string) {
    console.log(title);
    return await this.movieRepository.find();
  }

  async getMovieById(id: number) {
    const movie = await this.movieRepository.findOne({ where: { id } });

    if (!movie) return new NotFoundException();

    return movie;
  }

  async createMovie(title: string, genre: string) {
    const movie = this.movieRepository.create({ title, genre });

    await this.movieRepository.save(movie);

    return movie;
  }

  async updateMovie(id: number, title?: string, genre?: string) {
    const movie = await this.movieRepository.findOne({ where: { id } });

    if (!movie) return new NotFoundException();

    if (title) movie.title = title;
    if (genre) movie.genre = genre;

    await this.movieRepository.save(movie);

    return movie;
  }

  async deleteMovie(id: number) {
    const movie = await this.movieRepository.findOne({ where: { id } });

    if (!movie) return new NotFoundException();

    await this.movieRepository.remove(movie);

    return movie;
  }
}
