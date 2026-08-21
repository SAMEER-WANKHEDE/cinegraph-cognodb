import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { MoviesService } from './movies.service';

@Controller()
export class MoviesController {
  constructor(private readonly movies: MoviesService) {}

  @Get('movies')
  findAll(@Query('limit') limit?: string) {
    const parsed = limit ? Number(limit) : 12;
    return this.movies.findAll(
      Number.isFinite(parsed) ? Math.min(Math.max(parsed, 1), 50) : 12,
    );
  }

  @Get('movies/:id')
  findOne(@Param('id') id: string) {
    return this.movies.findOne(id);
  }

  @Get('movies/:id/actors')
  actors(@Param('id') id: string) {
    return this.movies.getActors(id);
  }

  @Get('movies/:id/connections')
  connections(@Param('id') id: string) {
    return this.movies.getConnections(id);
  }

  @Get('movies/:id/recommendations')
  recommendations(@Param('id') id: string) {
    return this.movies.getRecommendations(id);
  }

  @Get('search')
  search(@Query('q') q = '', @Query('limit') limit?: string) {
    const parsed = limit ? Number(limit) : 20;
    return this.movies.search(
      q,
      Number.isFinite(parsed) ? Math.min(Math.max(parsed, 1), 50) : 20,
    );
  }
}
