import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from 'src/entities/player.entity';

@Injectable()
export class PlayersService {
  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
  ) {}

  // 모든 선수 조회
  async findAll(): Promise<Player[]> {
    return this.playerRepository.find();
  }

  // 선수 등록
  async create(player: { name: string; level: string }) {
    // 1) 엔티티 생성
    const newPlayer = this.playerRepository.create({
      name: player.name,
      level: player.level,
      team: null,  // 기본값
    });
    // 2) DB에 저장
    return await this.playerRepository.save(newPlayer);
  }

  // 선수 정보 수정
  async update(
    id: number,
    updateData: { name?: string; age?: number; level?: string; team?: string },
  ) {
    const player = await this.playerRepository.findOne({ where: { id } });
    if (!player) {
      throw new NotFoundException('Player not found');
    }

    // 바뀔 수 있는 필드만 적용
    if (updateData.name !== undefined) player.name = updateData.name;
    if (updateData.level !== undefined) player.level = updateData.level;
    if (updateData.team !== undefined) player.team = updateData.team;

    return await this.playerRepository.save(player);
  }

  // 선수 삭제
  async delete(id: number) {
    const player = await this.playerRepository.findOne({ where: { id } });
    if (!player) {
      throw new NotFoundException('Player not found');
    }
    await this.playerRepository.remove(player);
    return { deleted: true, player };
  }

  // 특정 기준으로 선수 검색
  async searchPlayers(criteria: { level?: string; team?: string }) {
    // 간단한 예: QueryBuilder or where 조건
    // 여기선 예시로 if문 로직으로...
    const qb = this.playerRepository.createQueryBuilder('player');
    if (criteria.level) {
      // level >= criteria.level ?  (원본 코드는 >= 로 사용했지만, level은 string이라 직접 비교가 애매)
      qb.andWhere('player.level = :level', { level: criteria.level });
    }
    if (criteria.team) {
      qb.andWhere('player.team = :team', { team: criteria.team });
    }
    return qb.getMany();
  }

  // 승률 및 통계 계산
  async getPlayerStatistics() {
    // DB에 gamesPlayed, wins 같은 필드가 지금 없음.
    // 만약 필드 추가하면, 아래처럼 가져옴:
    const allPlayers = await this.playerRepository.find();
    return allPlayers.map((p) => ({
      id: p.id,
      name: p.name,
      gamesPlayed: (p as any).gamesPlayed || 0,
      wins: (p as any).wins || 0,
      winRate: (p as any).gamesPlayed
        ? ((p as any).wins / (p as any).gamesPlayed) * 100
        : 0,
    }));
  }

  // 실력에 따라 그룹화
  async groupPlayersByLevel() {
    const allPlayers = await this.playerRepository.find();
    const groups = {};
    allPlayers.forEach((player) => {
      const levelGroup = groups[player.level] || [];
      levelGroup.push(player);
      groups[player.level] = levelGroup;
    });
    return groups;
  }

  // 대량 선수 등록
  async bulkRegister(
    players: Array<{ name: string; level: number; team?: string }>,
  ) {
    const newPlayers = players.map((p) =>
      this.playerRepository.create({
        name: p.name,
        level: p.level?.toString() || '0',
        team: p.team || null,
      }),
    );
    return this.playerRepository.save(newPlayers);
  }

  // 선수 활동 기록 추가
  async addPlayerHistory(
    id: number,
    record: { date: string; points: number },
  ) {
    const player = await this.playerRepository.findOne({ where: { id } });
    if (!player) {
      throw new NotFoundException('Player not found');
    }
    // 만약 history를 Player 엔티티에 따로 필드로 저장하려면, DB 컬럼/관계 필요.
    // 일단 임시로 console.log만:
    console.log(`기록 추가: ${record.date}, ${record.points}`, player);
    return player;
  }
}