import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizersController } from './organizers.controller';
import { OrganizersService } from './organizers.service';
import { Game } from 'src/entities/game.entity';  // 새로 만든 Game 엔티티
import { Tournament } from 'src/entities/tournament.entity'; // 만약 여기서 직접 접근할 거라면
import { Player } from 'src/entities/player.entity'; 

@Module({
    imports: [
        TypeOrmModule.forFeature([Game, Tournament, Player]),
      ],
  controllers: [OrganizersController],
  providers: [OrganizersService],
})
export class OrganizersModule {}