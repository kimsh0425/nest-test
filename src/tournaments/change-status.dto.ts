import { IsIn, IsString } from 'class-validator';

export class ChangeStatusDto {
  @IsString({ message: 'Status must be a string.' })
  @IsIn(['대기', '진행중', '완료'], { message: 'Invalid status. Allowed values: 대기, 진행중, 완료.' })
  status: string;
}
