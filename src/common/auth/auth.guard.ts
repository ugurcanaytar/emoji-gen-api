import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { LoggerService } from '../../logger.service';

@Injectable()
export class AuthGuard implements CanActivate {
  // Dependency injection via constructor
  constructor(private readonly loggerService: LoggerService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    this.loggerService.info(`Guard: Checking authentication`);
    const request = context.switchToHttp().getRequest();
    const apiKey = request?.headers?.['x-api-key'];
    if (!apiKey) {
      throw new UnauthorizedException({
        message: 'API key is missing',
        error: 'No API key provided',
        statusCode: 401,
      });
    }
    if (apiKey !== 'SECRET') {
      throw new UnauthorizedException({
        message: 'Invalid API key',
        error: 'Authentication failed',
        statusCode: 401,
      });
    }
    this.loggerService.info(`Guard: Passed authentication`);
    return true;
  }
}
