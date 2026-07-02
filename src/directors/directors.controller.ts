import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DirectorsService } from './directors.service';
import { CreateDirectorDto } from './dto/create-director.dto';
import { UpdateDirectorDto } from './dto/update-director.dto';

@Controller('directors')
export class DirectorsController {
  constructor(private readonly directorsService: DirectorsService) {}

  @Post()
  async create(@Body() createDirectorDto: CreateDirectorDto) {
    return await this.directorsService.create(
      createDirectorDto.name,
      createDirectorDto.dob,
      createDirectorDto.nationality,
    );
  }

  @Get()
  async findAll() {
    return await this.directorsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.directorsService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDirectorDto: UpdateDirectorDto,
  ) {
    return await this.directorsService.update(
      +id,
      updateDirectorDto.name,
      updateDirectorDto.dob,
      updateDirectorDto.nationality,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.directorsService.remove(+id);
  }
}
