import { Module } from '@nestjs/common';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';

@Module({
  controllers: [PlayersController],
  providers: [PlayersService],
  exports: [PlayersService], // 다른 모듈에서도 PlayersService를 쓰고 싶다면 export
})
export class PlayersModule {}
