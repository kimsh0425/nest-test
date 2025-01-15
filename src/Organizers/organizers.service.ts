import { Injectable } from '@nestjs/common';

@Injectable()
export class OrganizersService {
  private games = [];
  private tournaments = [];
  private players = [];

  // 게임 생성
  createGame(gameData: { name: string; players: number }) {
    const newGame = { id: this.games.length + 1, ...gameData };
    this.games.push(newGame);
    return { message: 'Game created successfully', game: newGame };
  }

  // 게임 삭제
  deleteGame(id: number) {
    const gameIndex = this.games.findIndex((game) => game.id === id);
    if (gameIndex === -1) {
      throw new Error('Game not found');
    }
    const deletedGame = this.games.splice(gameIndex, 1);
    return { message: 'Game deleted successfully', game: deletedGame[0] };
  }

  // 대회 시작
  startTournament(id: number) {
    const tournament = this.tournaments.find((t) => t.id === id);
    if (!tournament) {
      throw new Error('Tournament not found');
    }
    tournament.status = 'started';
    return { message: 'Tournament started', tournament };
  }

  // 대회 종료
  endTournament(id: number) {
    const tournament = this.tournaments.find((t) => t.id === id);
    if (!tournament) {
      throw new Error('Tournament not found');
    }
    tournament.status = 'ended';
    return { message: 'Tournament ended', tournament };
  }

  // 선수 강제 탈락 처리
  disqualifyPlayer(id: number) {
    const player = this.players.find((p) => p.id === id);
    if (!player) {
      throw new Error('Player not found');
    }
    player.status = 'disqualified';
    return { message: 'Player disqualified', player };
  }
}
