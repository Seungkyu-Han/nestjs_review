import { Injectable, NotFoundException } from '@nestjs/common';

export interface Movie {
  id: number;
  title: string;
}

@Injectable()
export class MoviesService {
  private movies: Movie[] = [
    {
      id: 1,
      title: '해리포터',
    },
    {
      id: 2,
      title: '반지의 제왕',
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

  createMovie(title: string) {
    const movie: Movie = {
      id: this.nextId++,
      title,
    };

    this.movies.push(movie);

    return movie;
  }

  updateMovie(id: number, title: string) {
    const movie = this.movies.find((m) => m.id === id);

    if (!movie) return new NotFoundException();

    Object.assign(movie, { title });

    return movie;
  }

  deleteMovie(id: number) {
    const movieIndex = this.movies.findIndex((m) => m.id === id);

    if (movieIndex === -1) return new NotFoundException();

    this.movies.splice(movieIndex, 1);

    return;
  }
}
