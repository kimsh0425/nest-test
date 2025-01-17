import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tournament } from '../entities/tournament.entity';
import { Player } from '../entities/player.entity'; 

@Injectable()
export class TournamentsService {
  // TournamentsService가 Tournament와 Player 두 엔티티를 모두 다뤄야 하므로,
  // 각각의 Repository를 주입받아 사용한다.
  constructor(
    @InjectRepository(Tournament)
    private readonly tournamentRepository: Repository<Tournament>,

    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
  ) {}

  // 모든 토너먼트 조회
  async findAll() {
    return await this.tournamentRepository.find();
  }

  /**
   * [기존 findById] 토너먼트 하나 찾기
   */
  async findById(id: number): Promise<Tournament> {
    // relations: ['participants']로 참가자들도 같이 로드
    const tournament = await this.tournamentRepository.findOne({
      where: { id },
      relations: ['participants'],
    });
    if (!tournament) {
      throw new NotFoundException('Tournament not found');
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

  /**
   * [새로운 join 방식] 
   * - 이미 DB에 등록된 Player(선수)를 playerId로 찾아와
   * - 중복 여부 체크 후, 해당 Tournament에 참가시킨다.
   */
  async join(tournamentId: number, playerId: number) {
    // 1) 토너먼트 찾기 (+참가자들 relations)
    const tournament = await this.findById(tournamentId);

    // 2) 선수 찾기
    const player = await this.playerRepository.findOne({ where: { id: playerId } });
    if (!player) {
      throw new BadRequestException('Player not found');
    }

    // 3) 이미 참가 중인지 확인
    if (tournament.participants.some((p) => p.id === playerId)) {
      throw new BadRequestException('Participant already joined this tournament.');
    }

    // 4) 선수와 토너먼트의 관계 설정 (player.tournament)
    player.tournament = tournament;
    await this.playerRepository.save(player); // DB 반영 (player 테이블 업데이트)

    // 5) tournament의 participants 배열에도 추가
    tournament.participants.push(player);

    // 6) 토너먼트 DB 갱신
    return await this.tournamentRepository.save(tournament);
  }
}