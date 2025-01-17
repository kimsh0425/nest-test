import { Controller, Get, Post, Body, Put, Delete, Patch, Param, Headers, ForbiddenException } from '@nestjs/common';
import { TournamentsService } from './tournaments.service';
import { UpdateStatusDto } from '../entities/update-status.dto';

@Controller('tournaments')
export class TournamentsController {
  constructor(private readonly tournamentsService: TournamentsService) {}

  // 모든 토너먼트 조회
  @Get()
  findAll() {
    return this.tournamentsService.findAll();
  }

  // 특정 토너먼트 조회
  @Get(':id')
  findById(@Param('id') id: number) {
    return this.tournamentsService.findById(id);
  }

  // 토너먼트 생성
  @Post()
  create(@Body() createTournamentDto: { name: string; date: string; location: string }) {
    return this.tournamentsService.create(createTournamentDto);
  }

  // 토너먼트 수정
  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateTournamentDto: { name?: string; date?: string; location?: string },
  ) {
    return this.tournamentsService.update(id, updateTournamentDto);
  }

  // 토너먼트 삭제
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.tournamentsService.delete(id);
  }

  // 토너먼트 상태 변경
  @Patch(':id/status')
  changeStatus(
    @Param('id') id: number,
    @Body() updateStatusDto: UpdateStatusDto,
  ) {
    return this.tournamentsService.changeStatus(id, updateStatusDto.status);
  }

  // 참가자 추가 (중복 방지)
  @Post(':id/join')
join(@Param('id') id: number, @Body() body: { playerId: number }) {
  // 'playerId'라는 숫자를 body로 받는다
  return this.tournamentsService.join(id, body.playerId);
}
}