import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PlayersModule } from './players/players.module';
import { TournamentsModule } from './tournaments/tournaments.module';


@Module({
  imports: [PlayersModule, TournamentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

