import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  players: number; // 간단히 '인원 수'만 저장한다고 가정

  @Column({ default: '대기' })
  status: string; // '대기', '진행중', '완료' 등
}