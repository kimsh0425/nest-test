// tournaments.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class TournamentsService {
  private tournaments = [];
  private nextId = 1; // 고유 ID 생성용

  findAll() {
    return this.tournaments;
  }

  // 특정 토너먼트 조회
  findById(id: number) {
    const tournament = this.tournaments.find((t) => t.id === Number(id));
    if (!tournament) {
      throw new Error('Tournament not found');
    }
    return tournament;
  }

  // 토너먼트 생성
  create(createTournamentDto: { name: string; date: string; location: string }) {
    const newTournament = {
      id: this.nextId++,
      ...createTournamentDto,
      status: '대기', // 기본 상태
      participants: [], // 참가자 초기화
    };
    this.tournaments.push(newTournament);
    return newTournament;
  }

  // 토너먼트 수정
  update(id: number, updateData: { name?: string; date?: string; location?: string }) {
    const index = this.tournaments.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error('Tournament not found');
    }
    this.tournaments[index] = { ...this.tournaments[index], ...updateData };
    return this.tournaments[index];
  }

  // 토너먼트 삭제
  delete(id: number) {
    const index = this.tournaments.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error('Tournament not found');
    }
    const deletedTournament = this.tournaments.splice(index, 1);
    return { deleted: true, tournament: deletedTournament[0] };
  }

    // 토너먼트 상태 변경
    changeStatus(id: number, status: '대기' | '진행중' | '완료') {
      const tournament = this.findById(id);
      tournament.status = status;
      return tournament;
    }

  // 참가자 추가 (중복 방지)
  join(id: number, participantDto: { name: string }) {
    const tournament = this.findById(id);
    if (tournament.participants.some((p) => p.name === participantDto.name)) {
      throw new Error('Participant already joined this tournament.');
    }
    tournament.participants.push(participantDto);
    return { message: 'Successfully joined', tournament };
  }
}