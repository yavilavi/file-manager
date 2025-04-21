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
import { PrismaService } from '@libs/database/prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
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
    const passwordHash = await argon2.hash(user.password);

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

    const created = await this.prisma.client.$transaction(async (tx) => {
      const otherDepartments = company.departments.filter(
        (dp) => dp.name !== company.departments[user.departmentId].name,
      );
      const userDepartment = company.departments[user.departmentId];
      const createdCompany = await tx.company.create({
        data: {
          name: company.name,
          nit: company.nit,
          tenantId: company.tenantId,
          departments: {
            create: otherDepartments.map((dep) => ({
              name: dep.name,
            })),
          },
        },
        include: {
          departments: true,
        },
      });

      await tx.user.create({
        data: {
          name: user.name,
          email: user.email.toLowerCase(),
          password: passwordHash,
          isActive: true,
          company: {
            connect: {
              id: createdCompany.id,
            },
          },
          department: {
            create: {
              name: userDepartment.name,
              company: {
                connect: {
                  id: createdCompany.id,
                  tenantId: company.tenantId,
                },
              },
            },
          },
        },
      });

      return createdCompany;
    });

    this.eventEmitter.emit('company.created', signupDto);
    this.eventEmitter.emit('user.created', {
      user: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
      company: {
        name: company.name,
        tenantId: company.tenantId,
      },
    });

    return {
      redirectUrl: `${this.configService.get('protocol') ?? 'http'}://${created.tenantId}.${this.configService.getOrThrow('baseAppUrl')}`,
    };
  }
}
