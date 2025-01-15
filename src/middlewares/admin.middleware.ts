import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AdminMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const adminHeaderValue = req.headers['x-admin']?.toString().trim();
    console.log('x-admin Header Value (raw):', req.headers['x-admin']); // 원본 헤더 값 출력

    // /tournaments의 GET 요청은 관리자 권한 없이 허용
    if (req.method === 'GET' && req.originalUrl.startsWith('/tournaments')) {
      return next();
    }

    // x-admin 헤더가 정확히 "true"인 경우만 통과
    if (adminHeaderValue === 'true') {
        console.log('Admin access granted');
        return next();
    }
      

    console.log('Admin access denied'); // 실패 메시지
    return res.status(403).json({
      message: 'Access denied. Admins only!',
    });
  }
}
