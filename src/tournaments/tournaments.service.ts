import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tournament } from '../entities/tournament.entity';
import { Player } from '../entities/player.entity'; 

@Injectable()
export class TournamentsService {
  private participantIdCounter = 1; // 참가자 ID 순서대로 증가

  constructor(
    @InjectRepository(Tournament)
    private readonly tournamentRepository: Repository<Tournament>,
  ) {}

  // 모든 토너먼트 조회
  async findAll() {
    return await this.tournamentRepository.find();
  }

  // 특정 토너먼트 조회
  async findById(id: number) {
    const tournament = await this.tournamentRepository.findOne({ where: { id } });
    if (!tournament) {
      throw new NotFoundException('Tournament not found'); // 없는 경우 에러 반환
    }
    return tournament;
  }

  // 토너먼트 생성
  async create(createTournamentDto: { name: string; date: string; location: string }) {
    const newTournament = this.tournamentRepository.create({
      ...createTournamentDto,
      status: '대기', // 기본 상태 설정
      participants: [], // 참가자 초기화
    });
    return await this.tournamentRepository.save(newTournament); // 저장 후 반환
  }

  // 토너먼트 수정
  async update(
    id: number,
    updateData: { name?: string; date?: string; location?: string },
  ) {
    const tournament = await this.findById(id); // 기존 토너먼트 확인
    Object.assign(tournament, updateData); // 수정할 데이터 병합
    return await this.tournamentRepository.save(tournament); // 저장 후 반환
  }

  // 토너먼트 삭제
  async delete(id: number) {
    const tournament = await this.findById(id); // 삭제할 토너먼트 확인
    await this.tournamentRepository.remove(tournament); // 데이터베이스에서 제거
    return { deleted: true, tournament }; // 결과 반환
  }

  // 토너먼트 상태 변경
  async changeStatus(id: number, status: '대기' | '진행중' | '완료') {
    if (!['대기', '진행중', '완료'].includes(status)) {
      throw new BadRequestException('Invalid status value'); // 잘못된 상태값 처리
    }
    const tournament = await this.findById(id); // 변경할 토너먼트 확인
    tournament.status = status; // 상태 업데이트
    return await this.tournamentRepository.save(tournament); // 저장 후 반환
  }

  // 참가자 추가 (중복 방지)
  async join(id: number, participantDto: { name: string }) {
    const tournament = await this.findById(id); 
    if (tournament.participants.some(p => p.name === participantDto.name)) {
      throw new BadRequestException('Participant already joined this tournament.');
    }
  
    // Player 엔티티 객체를 직접 생성
    const participant = new Player();
    // DB가 자동 ID 생성하므로, 수동 id 할당 X
    participant.name = participantDto.name;
    participant.level = null; 
    participant.team = null;
    participant.tournament = tournament; // 여기서 tournament 필드도 세팅
  
    // push
    tournament.participants.push(participant);
  
    // save
    return await this.tournamentRepository.save(tournament);
  }
}