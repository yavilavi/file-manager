import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '@modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadInterface } from '@shared/interfaces/jwt-payload.interface';
import * as argon2 from 'argon2';
import { ConfigService } from '@nestjs/config';
import { SignupDto } from '@modules/auth/dtos/signup.dto';
import { CompanyService } from '@modules/company/company.service';
import { PrismaService } from '@libs/database/prisma/client/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
    private companyService: CompanyService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async validateUser(
    username: string,
    pass: string,
    tenantId?: string,
  ): Promise<false | JwtPayloadInterface> {
    const user = await this.usersService.findByEmail(
      username.toLowerCase(),
      tenantId,
      true,
    );
    if (!user || !user.isActive) return false;
    const passwordIsValid = await argon2.verify(user.password, pass);
    if (user.isActive && passwordIsValid) {
      return {
        aud: this.configService.getOrThrow<string>('jwt.aud'),
        sub: user.id,
        iss: this.configService.getOrThrow<string>('jwt.iss'),
      };
    }
    return false;
  }

  async login(tenantId: string, jwtPayload?: JwtPayloadInterface) {
    if (!jwtPayload)
      throw new UnauthorizedException('Usuario o contraseña inválidos');
    const dbUser = await this.usersService.findById(jwtPayload.sub, tenantId);
    if (dbUser) {
      const payload: JwtPayloadInterface = {
        aud: this.configService.getOrThrow<string>('jwt.aud'),
        sub: dbUser.id,
        iss: this.configService.getOrThrow<string>('jwt.iss'),
      };
      return {
        access_token: this.jwtService.sign({ ...payload }, { expiresIn: '8h' }),
      };
    }
    throw new UnauthorizedException('Usuario o contraseña inválidos');
  }

  async signup(signupDto: SignupDto) {
    const { company, user } = signupDto;
    user.password = await argon2.hash(user.password);

    const existingCompany = await this.prisma.client.company.findFirst({
      where: {
        nit: company.nit,
        deletedAt: null,
      },
      select: {
        nit: true,
      },
    });

    if (existingCompany) {
      throw new ConflictException(
        'Ya hay una compañía registrada con este NIT',
      );
    }

    const created = await this.prisma.client.company.create({
      data: {
        name: company.name,
        nit: company.nit,
        tenantId: company.tenantId,
        departments: {
          create: company.departments.map((dep) => ({
            name: dep.name,
          })),
        },
        users: {
          create: {
            name: user.name,
            email: user.email.toLowerCase(),
            password: user.password,
            isActive: true,
          },
        },
      },
    });

    return {
      redirectUrl: `${this.configService.get('protocol') ?? 'http'}://${created.tenantId}.${this.configService.getOrThrow('baseUrl')}`,
    };
  }
}
