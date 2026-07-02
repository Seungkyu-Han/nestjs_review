import { ArrayNotEmpty, IsArray, IsNotEmpty } from 'class-validator';

export class CreateMovieDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  genre: string;

  @IsNotEmpty()
  detail: string;

  @IsNotEmpty()
  directorId: number;

  @IsArray()
  @ArrayNotEmpty()
  genreIds: number[];
}
