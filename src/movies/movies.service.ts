import { Injectable, NotFoundException } from '@nestjs/common';
import { Movie } from './entities/movie.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { MovieDetail } from './entities/movie-detail.entity';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    @InjectRepository(MovieDetail)
    private readonly movieDetailRepository: Repository<MovieDetail>,
  ) {}

  async getManyMovies(title?: string) {
    if (!title)
      return await this.movieRepository.find({
        relations: ['movieDetail'],
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
      relations: ['movieDetail'],
    });

    if (!movie) return new NotFoundException();

    return movie;
  }

  async createMovie(title: string, genre: string, detail: string) {
    return await this.movieRepository.save({
      title: title,
      genre: genre,
      movieDetail: {
        detail: detail,
      },
    });
  }

  async updateMovie(
    id: number,
    title?: string,
    genre?: string,
    detail?: string,
  ) {
    const movie = await this.movieRepository.findOne({
      where: { id },
      relations: ['movieDetail'],
    });

    if (!movie) return new NotFoundException();

    if (title) movie.title = title;
    if (genre) movie.genre = genre;

    await this.movieRepository.save(movie);

    if (detail)
      await this.movieDetailRepository.update(
        {
          id: movie.movieDetail.id,
        },
        {
          detail,
        },
      );

    return movie;
  }

  async deleteMovie(id: number) {
    const movie = await this.movieRepository.findOne({ where: { id } });

    if (!movie) return new NotFoundException();

    await this.movieRepository.remove(movie);

    return movie;
  }
}
