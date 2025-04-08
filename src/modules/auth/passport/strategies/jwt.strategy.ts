import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '@modules/users/users.service';
import { JwtPayloadInterface } from '@shared/interfaces/jwt-payload.interface';
import { RequestUserInterface } from '@shared/interfaces/request-user-interface';
import { Request } from 'express';
import * as _ from 'lodash';
import { omit } from 'lodash';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('jwt.secret'),
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    payload: JwtPayloadInterface,
  ): Promise<RequestUserInterface> {
    const { tenantId } = req;
    const dbUser = await this.usersService.findById(payload.sub, tenantId);
    if (!dbUser) throw new UnauthorizedException('Invalid access token');
    return { data: omit(dbUser, 'password') };
  }
}
