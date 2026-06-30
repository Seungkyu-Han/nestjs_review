import { Injectable, NotFoundException } from '@nestjs/common';
import { Movie } from './entities/movie.entity';

@Injectable()
export class MoviesService {
  private movies: Movie[] = [
    {
      id: 1,
      title: '해리포터',
      genre: 'fantasy',
    },
    {
      id: 2,
      title: '반지의 제왕',
      genre: 'action',
    },
  ];

  private nextId = 3;

  getManyMovies(title?: string) {
    if (!title) return this.movies;

    return this.movies.filter((m) => m.title.includes(title));
  }

  getMovieById(id: number) {
    const movie = this.movies.find((m) => m.id === id);

    if (!movie) return new NotFoundException();

    return movie;
  }

  createMovie(title: string, genre: string) {
    const movie: Movie = {
      id: this.nextId++,
      title,
      genre,
    };

    this.movies.push(movie);

    return movie;
  }

  updateMovie(id: number, title?: string, genre?: string) {
    const movie = this.movies.find((m) => m.id === id);

    if (!movie) return new NotFoundException();

    Object.assign(movie, { title, genre });

    return movie;
  }

  deleteMovie(id: number) {
    const movieIndex = this.movies.findIndex((m) => m.id === id);

    if (movieIndex === -1) return new NotFoundException();

    this.movies.splice(movieIndex, 1);

    return;
  }
}
