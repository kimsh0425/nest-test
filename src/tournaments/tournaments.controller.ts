// tournaments.controller.ts
import { Controller, Get, Post, Body } from '@nestjs/common';
import { TournamentsService } from './tournaments.service';

@Controller('tournaments')
export class TournamentsController {
  constructor(private readonly tournamentsService: TournamentsService) {}

  @Get()
  findAll() {
    return this.tournamentsService.findAll();
  }

  @Post()
  create(@Body() createTournamentDto: { name: string; date: string; location: string }) {
    return this.tournamentsService.create(createTournamentDto);
  }
}
