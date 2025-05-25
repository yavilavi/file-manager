/**
 * File Manager - User Registration Use Case
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */

import { Injectable, Inject, ConflictException } from '@nestjs/common';
import {
  IPasswordHashingService,
  PASSWORD_HASHING_SERVICE,
} from '@shared/interfaces/password-hashing.interface';
import {
  IUserRepository,
  USER_REPOSITORY,
  ICreateUserData,
  IUserWithRelations,
} from '@shared/interfaces/user-repository.interface';

export interface RegisterUserCommand {
  name: string;
  email: string;
  password: string;
  tenantId: string;
  departmentId: number | null;
  isActive?: boolean;
}

/**
 * User Registration Use Case
 * Following Single Responsibility Principle (SRP) - only handles user registration
 * Following Dependency Inversion Principle (DIP) - depends on abstractions
 */
@Injectable()
export class UserRegistrationUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(PASSWORD_HASHING_SERVICE)
    private readonly passwordHashingService: IPasswordHashingService,
  ) {}

  /**
   * Register a new user
   * @param command - User registration data
   * @returns Promise with created user (without password)
   */
  async execute(command: RegisterUserCommand): Promise<IUserWithRelations> {
    const {
      name,
      email,
      password,
      tenantId,
      departmentId,
      isActive = true,
    } = command;

    // Check if user with email already exists
    const existingUser = await this.userRepository.findByEmail(
      email.toLowerCase(),
      tenantId,
    );

    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }

    // Hash password
    const hashedPassword = await this.passwordHashingService.hash(password);

    // Create user data
    const userData: ICreateUserData = {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      tenantId,
      departmentId,
      isActive,
    };

    // Create user
    return await this.userRepository.createUser(userData);
  }
}
