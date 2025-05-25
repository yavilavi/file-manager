/**
 * File Manager - auth.service Service
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
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
import { RoleInitializationService } from '@modules/tenant/application/services/role-initialization.service';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
    private roleInitializationService: RoleInitializationService,
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
      throw new UnauthorizedException('Usuario o contraseÃ±a invÃ¡lidos');
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
    throw new UnauthorizedException('Usuario o contraseÃ±a invÃ¡lidos');
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
        'Ya hay una compaÃ±Ã­a registrada con este NIT',
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

      const createdUser = await tx.user.create({
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

      // Create company plan if planId is provided
      if (company.planId) {
        await tx.companyPlan.create({
          data: {
            tenantId: company.tenantId,
            planId: company.planId,
            startDate: new Date(),
            isActive: true,
            storageUsed: BigInt(0),
          },
        });
      }

      // Initialize super admin role for the new company and assign it to the user
      await this.roleInitializationService.initializeSuperAdminRole({
        tenantId: company.tenantId,
        userId: createdUser.id,
        tx,
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
