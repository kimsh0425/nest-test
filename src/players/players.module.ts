import { Module } from '@nestjs/common';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from 'src/entities/player.entity';

@Module({
  imports: [
    // Player 엔티티를 이 모듈에서 사용
    TypeOrmModule.forFeature([Player]),
  ],
  controllers: [PlayersController],
  providers: [PlayersService],
  exports: [PlayersService], // 다른 모듈에서도 PlayersService를 쓰고 싶다면 export
})
export class PlayersModule {}