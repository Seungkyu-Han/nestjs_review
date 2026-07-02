import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class UpdateMovieDto {
  @IsNotEmpty()
  @IsOptional()
  title?: string;

  @IsArray()
  @ArrayNotEmpty()
  genreIds: number[];

  @IsNotEmpty()
  @IsOptional()
  detail?: string;

  @IsNotEmpty()
  @IsOptional()
  directorId?: number;
}
