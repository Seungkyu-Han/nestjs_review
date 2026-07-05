import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MoviesService } from './movies.service';
import { Movie } from './entities/movie.entity';

@Controller('movies')
@UsePipes(ValidationPipe)
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  async getMovies(@Query('title') title?: string): Promise<Movie[]> {
    return await this.moviesService.getManyMovies(title);
  }

  @Get(':id')
  getMovie(@Param('id', ParseIntPipe) id: number) {
    return this.moviesService.getMovieById(+id);
  }

  @Post()
  postMovie(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.createMovie(
      createMovieDto.title,
      createMovieDto.genre,
      createMovieDto.detail,
      createMovieDto.directorId,
      createMovieDto.genreIds,
    );
  }

  @Patch(':id')
  patchMovie(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto) {
    return this.moviesService.updateMovie(
      +id,
      updateMovieDto.title,
      updateMovieDto.genreIds,
      updateMovieDto.detail,
      updateMovieDto.directorId,
    );
  }

  @Delete(':id')
  deleteMovie(@Param('id') id: string) {
    return this.moviesService.deleteMovie(+id);
  }
}
