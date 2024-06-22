import { Injectable, NestMiddleware, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AdminMiddleware.name);

  constructor(private readonly jwtService: JwtService) {}

  use(req: any, res: any, next: () => void) {
    this.logger.log('AdminMiddleware: Checking authorization header');
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      this.logger.warn('AdminMiddleware: Authorization header missing');
      throw new UnauthorizedException('Authorization header missing');
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded = this.jwtService.verify(token);
      this.logger.log(`AdminMiddleware: Token decoded, user roles: ${decoded.roles}`);
      if (!decoded.roles || !decoded.roles.includes('admin')) {
        this.logger.warn('AdminMiddleware: User is not an admin');
        throw new UnauthorizedException('Not an admin');
      }
      req.user = decoded;
      next();
    } catch (e) {
      this.logger.error('AdminMiddleware: Invalid token', e.stack);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
