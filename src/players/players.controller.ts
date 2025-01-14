import { Controller, Get, Post, Put, Delete, Body, Param, UseInterceptors, UploadedFile } from '@nestjs/common';
import { PlayersService } from './players.service';
import { FileInterceptor } from '@nestjs/platform-express';

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

  // 선수 정보 수정
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updatePlayerDto: { name?: string; age?: number; level?: string; team?: string },
  ) {
    return this.playersService.update(Number(id), updatePlayerDto);
  }

  // 선수 삭제
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.playersService.delete(id);
  }

  // 특정 기준으로 선수 검색
@Get('search')
search(
  @Body() criteria: { level?: number; team?: string },
) {
  return this.playersService.searchPlayers(criteria);
}

// 선수 통계 조회
@Get('statistics')
getStatistics() {
  return this.playersService.getPlayerStatistics();
}

// 선수 그룹화 조회
@Get('groups')
getGroups() {
  return this.playersService.groupPlayersByLevel();
}

// 파일 업로드 처리
@Post('upload')
@UseInterceptors(FileInterceptor('file'))
async bulkUpload(@UploadedFile() file: Express.Multer.File) {
  const csvData = file.buffer.toString('utf-8');
  const players = this.parseCsv(csvData); // CSV 데이터를 객체로 변환
  return this.playersService.bulkRegister(players);
}

private parseCsv(data: string): Array<{ name: string; level: number; team?: string }> {
  const rows = data.split('\n');
  return rows.map((row) => {
    const [name, level, team] = row.split(',');
    return { name, level: Number(level), team };
  });
}

// 선수 활동 기록 추가
@Post(':id/history')
addHistory(
  @Param('id') id: number,
  @Body() record: { date: string; points: number },
) {
  return this.playersService.addPlayerHistory(id, record);
}
}

