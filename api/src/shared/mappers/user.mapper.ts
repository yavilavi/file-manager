/**
 * File Manager - User Mapper
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */

import { Injectable } from '@nestjs/common';
import { BaseRelationalMapper } from './base-mapper';
import { IUser, IUserWithRelations, ICreateUserData } from '@shared/interfaces';
import { User as PrismaUser } from '@prisma/client';

/**
 * User DTO for API responses
 */
export interface UserDto {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  departmentId: number | null;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
  department?: {
    id: number;
    name: string;
  } | null;
  company?: {
    id: number;
    name: string;
    nit: string;
    tenantId: string;
    canSendEmail: boolean;
  } | null;
}

/**
 * User creation DTO
 */
export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  departmentId: number | null;
  tenantId: string;
  isActive?: boolean;
}

/**
 * Prisma User with relations type
 */
type PrismaUserWithRelations = PrismaUser & {
  department?: {
    id: number;
    name: string;
  } | null;
  company?: {
    id: number;
    name: string;
    nit: string;
    tenantId: string;
    canSendEmail: boolean;
  } | null;
};

/**
 * User mapper implementation following SOLID principles
 * Single Responsibility: Only handles User entity transformations
 * Open/Closed: Can be extended for additional transformation logic
 * Dependency Inversion: Depends on abstractions (BaseMapper)
 */
@Injectable()
export class UserMapper extends BaseRelationalMapper<
  IUser,
  PrismaUser,
  IUserWithRelations,
  UserDto
> {
  /**
   * Convert from Prisma model to domain entity
   * Following Single Responsibility Principle
   */
  toDomain(persistence: PrismaUser): IUser {
    this.validateRequired<PrismaUser>(
      persistence,
      ['id', 'name', 'email', 'tenantId', 'createdAt', 'updatedAt'],
      'User',
    );

    return {
      id: persistence.id,
      name: persistence.name,
      email: persistence.email,
      password: persistence.password,
      departmentId: persistence.departmentId,
      tenantId: persistence.tenantId,
      isActive: persistence.isActive,
      ...this.mapAuditFields(persistence),
      deletedAt: persistence.deletedAt,
    };
  }

  /**
   * Convert from Prisma model with relations to domain entity with relations
   * Following Interface Segregation Principle
   */
  toDomainWithRelations(
    persistence: PrismaUserWithRelations,
  ): IUserWithRelations {
    const baseUser = this.toDomain(persistence);

    // Remove password from the result to match IUserWithRelations interface
    const { password, ...userWithoutPassword } = baseUser;

    return {
      ...userWithoutPassword,
      department: persistence.department
        ? {
            id: persistence.department.id,
            name: persistence.department.name,
          }
        : null,
      company: persistence.company
        ? {
            id: persistence.company.id,
            name: persistence.company.name,
            nit: persistence.company.nit,
            tenantId: persistence.company.tenantId,
            canSendEmail: persistence.company.canSendEmail,
          }
        : null,
    };
  }

  /**
   * Convert from domain entity to Prisma model
   * Following Single Responsibility Principle
   */
  toPersistence(
    domain: IUser,
  ): Omit<PrismaUser, 'id' | 'createdAt' | 'updatedAt'> {
    return this.cleanObject({
      name: domain.name,
      email: domain.email,
      password: domain.password,
      departmentId: domain.departmentId,
      tenantId: domain.tenantId,
      isActive: domain.isActive,
      deletedAt: domain.deletedAt,
    });
  }

  /**
   * Convert from domain entity to DTO (excludes password)
   * Following Security and Interface Segregation principles
   */
  toDto(domain: IUser): UserDto {
    return {
      id: domain.id,
      name: domain.name,
      email: domain.email,
      isActive: domain.isActive,
      departmentId: domain.departmentId,
      tenantId: domain.tenantId,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    };
  }

  /**
   * Convert from domain entity with relations to DTO
   * Following Interface Segregation Principle
   */
  toDtoWithRelations(domain: IUserWithRelations): UserDto {
    return {
      id: domain.id,
      name: domain.name,
      email: domain.email,
      isActive: domain.isActive,
      departmentId: domain.departmentId,
      tenantId: domain.tenantId,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
      department: domain.department,
      company: domain.company,
    };
  }

  /**
   * Convert from DTO to domain entity (for creation)
   * Following Single Responsibility Principle
   */
  fromDto(dto: UserDto): Omit<IUser, 'id' | 'createdAt' | 'updatedAt'> {
    return this.cleanObject({
      name: dto.name,
      email: dto.email.toLowerCase(), // Normalize email
      password: '', // Password should be set separately for security
      departmentId: dto.departmentId,
      tenantId: dto.tenantId,
      isActive: dto.isActive,
      deletedAt: null,
    });
  }

  /**
   * Convert from CreateUserDto to domain entity (for creation)
   * Following Single Responsibility Principle
   */
  fromCreateDto(
    dto: CreateUserDto,
  ): Omit<IUser, 'id' | 'createdAt' | 'updatedAt'> {
    return this.cleanObject({
      name: dto.name,
      email: dto.email.toLowerCase(), // Normalize email
      password: dto.password,
      departmentId: dto.departmentId,
      tenantId: dto.tenantId,
      isActive: dto.isActive ?? true,
      deletedAt: null,
    });
  }

  /**
   * Convert from ICreateUserData to domain entity
   * Following Adapter pattern
   */
  fromCreateUserData(
    data: ICreateUserData,
  ): Omit<IUser, 'id' | 'createdAt' | 'updatedAt'> {
    return this.cleanObject({
      name: data.name,
      email: data.email.toLowerCase(),
      password: data.password,
      departmentId: data.departmentId,
      tenantId: data.tenantId,
      isActive: data.isActive ?? true,
      deletedAt: null,
    });
  }

  /**
   * Batch convert domain entities with relations to DTOs
   * Following DRY principle
   */
  toDtoWithRelationsList(domainList: IUserWithRelations[]): UserDto[] {
    return domainList.map((item) => this.toDtoWithRelations(item));
  }

  /**
   * Create safe user DTO (excludes sensitive information)
   * Following Security principles
   */
  toSafeDto(domain: IUserWithRelations): Omit<UserDto, 'email'> {
    const dto = this.toDtoWithRelations(domain);
    const { email, ...safeDto } = dto;
    return safeDto;
  }

  /**
   * Create minimal user DTO (for references)
   * Following Interface Segregation Principle
   */
  toMinimalDto(domain: IUser): { id: number; name: string; email: string } {
    return {
      id: domain.id,
      name: domain.name,
      email: domain.email,
    };
  }
}
