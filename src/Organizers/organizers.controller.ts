import { Controller, Post, Delete, Patch, Param, Body } from '@nestjs/common';
import { OrganizersService } from './organizers.service';

@Controller('organizers')
export class OrganizersController {
  constructor(private readonly organizersService: OrganizersService) {}

  // 게임 생성
  @Post('games')
  createGame(@Body() gameData: { name: string; players: number }) {
    return this.organizersService.createGame(gameData);
  }

  // 게임 삭제
  @Delete('games/:id')
  deleteGame(@Param('id') id: number) {
    return this.organizersService.deleteGame(id);
  }

  // 대회 시작
  @Patch('tournaments/:id/start')
  startTournament(@Param('id') id: number) {
    return this.organizersService.startTournament(id);
  }

  // 대회 종료
  @Patch('tournaments/:id/end')
  endTournament(@Param('id') id: number) {
    return this.organizersService.endTournament(id);
  }

  // 선수 강제 탈락 처리
  @Patch('players/:id/disqualify')
  disqualifyPlayer(@Param('id') id: number) {
    return this.organizersService.disqualifyPlayer(id);
  }
}
