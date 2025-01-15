import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ValidationPipe 전역 설정
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 요청에서 DTO에 정의되지 않은 값은 제거
      forbidNonWhitelisted: true, // DTO에 정의되지 않은 값이 있으면 에러 반환
      transform: true, // 요청 데이터를 자동으로 타입 변환
    }),
  );
  
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
