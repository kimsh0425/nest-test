import { IsEnum } from 'class-validator';

export class UpdateStatusDto {
  @IsEnum(['대기', '진행중', '완료'], {
    message: 'status는 "대기", "진행중", "완료" 중 하나여야 합니다.',
  })
  status: '대기' | '진행중' | '완료';
}
