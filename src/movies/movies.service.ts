import { Injectable, NotFoundException } from '@nestjs/common';
import { Movie } from './entities/movie.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Like, Repository } from 'typeorm';
import { Director } from '../directors/entities/director.entity';
import { Genre } from '../genres/entities/genre.entity';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    @InjectRepository(Director)
    private readonly directorRepository: Repository<Director>,
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
  ) {}

  async getManyMovies(title?: string) {
    if (!title)
      return await this.movieRepository.find({
        relations: ['movieDetail', 'director'],
      });

    return await this.movieRepository.find({
      where: {
        title: Like(`%${title}%`),
      },
      relations: ['movieDetail'],
    });
  }

  async getMovieById(id: number) {
    const movie = await this.movieRepository.findOne({
      where: { id },
      relations: ['movieDetail', 'director'],
    });

    if (!movie) return new NotFoundException();

    return movie;
  }

  async createMovie(
    title: string,
    genre: string,
    detail: string,
    directorId: number,
    genreIds: number[],
  ) {
    const director = await this.directorRepository.findOne({
      where: { id: directorId },
    });

    const genres = await this.genreRepository.find({
      where: { id: In(genreIds) },
    });

    if (genres.length !== genreIds.length) {
      throw new NotFoundException();
    }

    if (!director) throw new NotFoundException();

    return await this.movieRepository.save({
      title: title,
      genre: genre,
      movieDetail: {
        detail: detail,
      },
      director,
      genres,
    });
  }

  async updateMovie(
    id: number,
    title?: string,
    genre?: string,
    detail?: string,
    directorId?: number,
  ) {
    const movie = await this.movieRepository.findOne({
      where: { id },
      relations: ['movieDetail'],
    });

    let newDirector: Director | null = null;

    if (directorId) {
      const director = await this.directorRepository.findOne({
        where: {
          id: directorId,
        },
      });

      if (!director) throw new NotFoundException();

      newDirector = director;
    }

    if (!movie) return new NotFoundException();

    if (title) movie.title = title;
    if (genre) movie.genre = genre;
    if (detail) movie.movieDetail.detail = detail;
    if (newDirector) movie.director = newDirector;

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
