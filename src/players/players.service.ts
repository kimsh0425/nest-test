import { Injectable } from '@nestjs/common';

@Injectable()
export class PlayersService {
  private players = [];
  private nextId = 1; // 고유 번호를 생성하기 위한 초기값

  // 모든 선수 조회
  findAll() {
    return this.players;
  }

  // 선수 등록
  create(player: { name: string; level: string }) {
    const newPlayer = { id: this.nextId, ...player }; // 현재 nextId를 고유 번호로 설정
    this.players.push(newPlayer);
    this.nextId++; // 다음 고유 번호로 증가
    return newPlayer;
  }

  // 선수 정보 수정
  update(
    id: number,
    updateData: { name?: string; age?: number; level?: string; team?: string },
  ) {
    const playerIndex = this.players.findIndex((p) => p.id === id);
    if (playerIndex === -1) {
      throw new Error('Player not found');
    }

    this.players[playerIndex] = {
      ...this.players[playerIndex],
      ...updateData,
    };

    return this.players[playerIndex];
  }

  // 선수 삭제
  delete(id: number) {
    const playerIndex = this.players.findIndex((p) => p.id === id);
    if (playerIndex === -1) {
      throw new Error('Player not found');
    }

    const deletedPlayer = this.players.splice(playerIndex, 1);
    return { deleted: true, player: deletedPlayer[0] };
  }

  // 특정 기준으로 선수 검색
searchPlayers(criteria: { level?: number; team?: string }) {
  return this.players.filter((player) => {
    return (
      (criteria.level === undefined || player.level >= criteria.level) &&
      (criteria.team === undefined || player.team === criteria.team)
    );
  });
}

// 승률 및 통계 계산
getPlayerStatistics() {
  return this.players.map((player) => {
    return {
      id: player.id,
      name: player.name,
      gamesPlayed: player.gamesPlayed || 0,
      wins: player.wins || 0,
      winRate: player.gamesPlayed
        ? ((player.wins || 0) / player.gamesPlayed) * 100
        : 0,
    };
  });
}

// 실력에 따라 그룹화
groupPlayersByLevel() {
  return this.players.reduce((groups, player) => {
    const levelGroup = groups[player.level] || [];
    levelGroup.push(player);
    groups[player.level] = levelGroup;
    return groups;
  }, {});
}

// 대량 선수 등록
bulkRegister(players: Array<{ name: string; level: number; team?: string }>) {
  players.forEach((player) => {
    const newPlayer = { id: this.nextId++, ...player };
    this.players.push(newPlayer);
  });
  return this.players;
}

// 선수 활동 기록 추가
addPlayerHistory(
  id: number,
  record: { date: string; points: number },
) {
  const player = this.players.find((p) => p.id === id);
  if (!player) {
    throw new Error('Player not found');
  }
  if (!player.history) {
    player.history = [];
  }
  player.history.push(record);
  return player;
}
}
