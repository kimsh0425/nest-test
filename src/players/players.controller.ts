import { Controller, Get, Post, Body } from '@nestjs/common';
import { PlayersService } from './players.service';

// '/players' 경로로 들어오는 요청을 처리
@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  // 모든 선수 조회
  @Get()
  findAll() {
    return this.playersService.findAll();
  }

  // 선수 등록 (이름, 실력 부수 받기)
  @Post()
  create(@Body() createPlayerDto: { name: string; level: string }) {
    // createPlayerDto는 단순 예시: { "name": "홍길동", "level": "초급" }
    return this.playersService.create(createPlayerDto);
  }
}
