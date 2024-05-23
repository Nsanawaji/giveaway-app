import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class BlockGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    // console.log(user);
    if (user && user.isBlock) {
      throw new UnauthorizedException('Your account has been blocked');
    }
    return true;
  }
}
