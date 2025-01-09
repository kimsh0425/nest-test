import { Injectable } from '@nestjs/common';

@Injectable()
export class PlayersService {
  // 실제로는 DB를 쓸 텐데, 여기서는 임시 배열로 예시
  private players = [];

  findAll() {
    return this.players;
  }

  create(createPlayerDto: { name: string; level: string }) {
    // id는 임시로 Date.now() 같은 걸로 생성
    const newPlayer = {
      id: Date.now(),
      name: createPlayerDto.name,
      level: createPlayerDto.level,
    };
    this.players.push(newPlayer);
    return newPlayer;
  }
}
