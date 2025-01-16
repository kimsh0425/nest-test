import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Tournament } from './tournament.entity';

@Entity()
export class Player {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  level: string;

  @Column({ nullable: true })
  team: string;

  // Tournament와의 ManyToOne 관계 설정
  @ManyToOne(() => Tournament, (tournament) => tournament.participants, { nullable: true })
  tournament: Tournament;
}
