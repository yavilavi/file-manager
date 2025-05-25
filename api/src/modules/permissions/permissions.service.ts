/**
 * File Manager - permissions.service Service
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */
import { Injectable, Inject } from '@nestjs/common';
import {
  IPermissionRepository,
  PERMISSION_REPOSITORY,
} from '@shared/interfaces/permission-repository.interface';
import { PermissionDomainService } from './domain/services/permission-domain.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { Permission } from './interfaces/permission.interface';

/**
 * Refactored PermissionsService following Clean Architecture principles
 * Following Single Responsibility Principle (SRP) - delegates to repository and domain service
 * Following Dependency Inversion Principle (DIP) - depends on abstractions
 */
@Injectable()
export class PermissionsService {
  constructor(
    @Inject(PERMISSION_REPOSITORY)
    private readonly permissionRepository: IPermissionRepository,
    private readonly permissionDomainService: PermissionDomainService,
  ) {}

  /**
   * Create a new permission
   * @param createPermissionDto - Permission creation data
   * @returns Promise with created permission
   */
  async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    const createdPermission = await this.permissionRepository.createPermission({
      id: createPermissionDto.id,
      description: createPermissionDto.description,
    });

    return this.toPermissionInterface(createdPermission);
  }

  /**
   * Find all permissions
   * @returns Promise with array of permissions
   */
  async findAll(): Promise<Permission[]> {
    const permissions = await this.permissionRepository.findAll();
    return permissions.map((permission) =>
      this.toPermissionInterface(permission),
    );
  }

  /**
   * Find permission by ID
   * @param id - Permission ID
   * @returns Promise with permission or null if not found
   */
  async findById(id: string): Promise<Permission | null> {
    const permission = await this.permissionRepository.findById(id);
    return permission ? this.toPermissionInterface(permission) : null;
  }

  /**
   * Find multiple permissions by IDs
   * @param ids - Array of permission IDs
   * @returns Promise with array of permissions
   */
  async findByIds(ids: string[]): Promise<Permission[]> {
    if (ids.length === 0) return [];

    const permissions = await Promise.all(
      ids.map((id) => this.permissionRepository.findById(id)),
    );

    return permissions
      .filter((permission) => permission !== null)
      .map((permission) => this.toPermissionInterface(permission));
  }

  /**
   * Remove permission by ID
   * @param id - Permission ID
   * @returns Promise with deleted permission
   */
  async remove(id: string): Promise<Permission> {
    const permission = await this.permissionRepository.findById(id);
    if (!permission) {
      throw new Error(`Permission with ID ${id} not found`);
    }

    await this.permissionRepository.deletePermission(id);
    return this.toPermissionInterface(permission);
  }

  /**
   * Check if user has specific permission
   * @param userId - User ID
   * @param permissionId - Permission ID
   * @param tenantId - Tenant ID
   * @returns Promise with boolean indicating if user has permission
   */
  async hasPermission(
    userId: number,
    permissionId: string,
    tenantId: string,
  ): Promise<boolean> {
    return await this.permissionDomainService.hasPermission(
      userId,
      permissionId,
      tenantId,
    );
  }

  /**
   * Check if user has any of the specified permissions
   * @param userId - User ID
   * @param permissionIds - Array of permission IDs
   * @param tenantId - Tenant ID
   * @returns Promise with boolean indicating if user has any permission
   */
  async hasAnyPermission(
    userId: number,
    permissionIds: string[],
    tenantId: string,
  ): Promise<boolean> {
    return await this.permissionDomainService.hasAnyPermission(
      userId,
      permissionIds,
      tenantId,
    );
  }

  /**
   * Get all permissions for a user
   * @param userId - User ID
   * @param tenantId - Tenant ID
   * @returns Promise with array of permission IDs
   */
  async getUserPermissions(
    userId: number,
    tenantId: string,
  ): Promise<string[]> {
    return await this.permissionDomainService.getUserPermissions(
      userId,
      tenantId,
    );
  }

  /**
   * Find permissions by resource
   * @param resource - Resource name
   * @returns Promise with array of permissions
   */
  async findByResource(resource: string): Promise<Permission[]> {
    const permissions =
      await this.permissionRepository.findByResource(resource);
    return permissions.map((permission) =>
      this.toPermissionInterface(permission),
    );
  }

  /**
   * Find permissions by action
   * @param action - Action name
   * @returns Promise with array of permissions
   */
  async findByAction(action: string): Promise<Permission[]> {
    const permissions = await this.permissionRepository.findByAction(action);
    return permissions.map((permission) =>
      this.toPermissionInterface(permission),
    );
  }

  /**
   * Get unique resources from all permissions
   * @returns Promise with array of unique resource names
   */
  async getUniqueResources(): Promise<string[]> {
    return await this.permissionRepository.getUniqueResources();
  }

  /**
   * Get unique actions from all permissions
   * @returns Promise with array of unique action names
   */
  async getUniqueActions(): Promise<string[]> {
    return await this.permissionRepository.getUniqueActions();
  }

  /**
   * Convert domain permission to interface
   * @param permission - Domain permission entity
   * @returns Permission interface
   */
  private toPermissionInterface(permission: any): Permission {
    return {
      id: permission.id,
      description: permission.description,
      createdAt: permission.createdAt,
      updatedAt: permission.updatedAt,
    };
  }
}
