import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Player } from './player.entity';

@Entity()
export class Tournament {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  date: string;

  @Column()
  location: string;

  @Column({
    type: 'enum',
    enum: ['대기', '진행중', '완료'],
    default: '대기',
  })
  status: string;

  @OneToMany(() => Player, (player) => player.tournament)
participants: Player[];
}