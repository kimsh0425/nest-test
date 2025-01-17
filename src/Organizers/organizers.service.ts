import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from 'src/entities/game.entity';
import { Tournament } from 'src/entities/tournament.entity';    

@Injectable()
export class OrganizersService {
  // DB에 저장
  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,

    @InjectRepository(Tournament)
    private readonly tournamentRepository: Repository<Tournament>,
  ) {}

  // 게임 생성
  async createGame(gameData: { name: string; players: number }) {
    // 1) 엔티티 생성
    const newGame = this.gameRepository.create({
      name: gameData.name,
      players: gameData.players,
      status: 'not started',
    });
    // 2) DB 저장
    await this.gameRepository.save(newGame);
    return { message: 'Game created successfully', game: newGame };
  }

  // 게임 삭제
  async deleteGame(id: number) {
    const game = await this.gameRepository.findOne({ where: { id } });
    if (!game) {
      throw new NotFoundException('Game not found');
    }
    await this.gameRepository.remove(game);
    return { message: 'Game deleted successfully', game };
  }

  // 대회 시작
  async startTournament(id: number) {
    // DB에서 tournament 찾아서 상태 변경
    const tournament = await this.tournamentRepository.findOne({ where: { id } });
    if (!tournament) {
      throw new NotFoundException('Tournament not found');
    }
    tournament.status = '진행중'; // or "started"
    await this.tournamentRepository.save(tournament);
    return { message: 'Tournament started', tournament };
  }

  // 대회 종료
  async endTournament(id: number) {
    const tournament = await this.tournamentRepository.findOne({ where: { id } });
    if (!tournament) {
      throw new NotFoundException('Tournament not found');
    }
    tournament.status = '완료'; // or "ended"
    await this.tournamentRepository.save(tournament);
    return { message: 'Tournament ended', tournament };
  }

  // 선수 강제 탈락 처리
  async disqualifyPlayer(id: number) {
    // 여기서 'players'를 어떻게 관리할지?
    // - Player 엔티티가 있다면, DB에서 찾는다:
    // const player = await this.playerRepository.findOne({ where: { id } });
    // if (!player) throw new NotFoundException('Player not found');
    // player.status = 'disqualified'; // 전제: Player 엔티티에 status 필드가 있어야 한다
    // return await this.playerRepository.save(player);

    // 만약 Player 엔티티에 'status' 컬럼이 없다면, 하나 추가하거나, 
    // DB 테이블에 'disqualified' 표시할 로직을 만들어야 함.
    return { message: 'Not implemented yet (need player entity update)' };
  }
}