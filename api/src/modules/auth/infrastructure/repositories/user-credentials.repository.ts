/**
 * File Manager - User Credentials Repository Implementation
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */

import { Injectable } from '@nestjs/common';
import { IUserCredentialsRepository } from '../../domain/repositories/user-credentials.repository.interface';
import { UserCredentialsEntity } from '../../domain/entities/user-credentials.entity';
import { Email } from '@shared/domain/value-objects/email.value-object';
import { IUserRepository, USER_REPOSITORY } from '@shared/interfaces/user-repository.interface';
import { Inject } from '@nestjs/common';

/**
 * User Credentials Repository Implementation
 * Following Dependency Inversion Principle (DIP) - implements domain interface
 * Following Adapter Pattern - adapts infrastructure concerns to domain needs
 */
@Injectable()
export class UserCredentialsRepository implements IUserCredentialsRepository {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  /**
   * Find user credentials by email within tenant scope
   * @param email - User email value object
   * @param tenantId - Optional tenant ID for scope
   * @returns Promise with user credentials or null if not found
   */
  async findByEmail(email: Email, tenantId?: string): Promise<UserCredentialsEntity | null> {
    const user = await this.userRepository.findByEmail(
      email.value,
      tenantId,
      true, // includePassword
    );

    if (!user || !user.password) {
      return null;
    }

    return UserCredentialsEntity.create(
      user.id,
      user.email,
      user.password,
      user.isActive,
      user.tenantId,
      user.departmentId,
    );
  }

  /**
   * Find user credentials by ID within tenant scope
   * @param id - User ID
   * @param tenantId - Optional tenant ID for scope
   * @returns Promise with user credentials or null if not found
   */
  async findById(id: number, tenantId?: string): Promise<UserCredentialsEntity | null> {
    const user = await this.userRepository.findByIdWithRelations(
      id,
      tenantId,
      true, // includePassword
    );

    if (!user || !user.password) {
      return null;
    }

    return UserCredentialsEntity.create(
      user.id,
      user.email,
      user.password,
      user.isActive,
      user.tenantId,
      user.departmentId,
    );
  }
} 