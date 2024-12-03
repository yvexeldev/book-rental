import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
    Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../config/types';

@Injectable()
export class SuperAdminGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException('Token not found');
        }

        try {
            const payload: JwtPayload =
                await this.jwtService.verifyAsync(token);
            if (payload.role === 'SUPERADMIN') {
                request.user = { id: payload.sub, role: payload.role };
                return true;
            }
        } catch (error) {
            Logger.log({ error });
            throw new UnauthorizedException('Invalid token!');
        }
    }

    private extractTokenFromHeader(request: any): string | null {
        const authorization = request.headers.authorization;
        if (authorization && authorization.startsWith('Bearer ')) {
            return authorization.split(' ')[1];
        }
        return null;
    }
}
