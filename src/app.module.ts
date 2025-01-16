import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayersModule } from './players/players.module';
import { TournamentsModule } from './tournaments/tournaments.module';
import { AdminMiddleware } from './middlewares/admin.middleware';

@Module({
  imports: [
    TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'your_root_password',
    database: 'tournament_app',
    autoLoadEntities: true, // 엔티티를 자동으로 로드
    synchronize: true, // 개발 환경에서만 사용 (운영 환경에서는 false)
  }),
  PlayersModule, 
  TournamentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AdminMiddleware).forRoutes('tournaments');
  }
}
