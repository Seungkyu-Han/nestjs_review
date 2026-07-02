import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { MovieDetail } from './movie-detail.entity';
import { Director } from '../../directors/entities/director.entity';
import { Genre } from '../../genres/entities/genre.entity';

@Entity()
export class Movie extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  genre: string;

  @OneToOne(() => MovieDetail, (movieDetail) => movieDetail.movie, {
    cascade: true,
  })
  movieDetail: MovieDetail;

  @ManyToOne(() => Director, (director) => director.movies, { nullable: false })
  director: Director;

  @ManyToMany(() => Genre, (genre) => genre.movies)
  genres: Genre[];
}
