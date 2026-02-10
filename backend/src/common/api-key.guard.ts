import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];
    const validKey = process.env.ADMIN_API_KEY;

    if (!validKey || apiKey !== validKey) {
      throw new UnauthorizedException('Invalid or missing API key');
    }

    return true;
  }
}
