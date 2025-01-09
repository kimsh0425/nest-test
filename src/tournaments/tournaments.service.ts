// tournaments.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class TournamentsService {
  private tournaments = [];

  findAll() {
    return this.tournaments;
  }

  create(createTournamentDto: { name: string; date: string; location: string }) {
    const newTournament = {
      id: Date.now(),
      ...createTournamentDto,
    };
    this.tournaments.push(newTournament);
    return newTournament;
  }
}
