/**
 * File Manager - Base Mapper Classes
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */

/**
 * Base mapper interface following SOLID principles
 * Following Interface Segregation Principle (ISP) and Dependency Inversion Principle (DIP)
 * 
 * @template TDomain - Domain entity type
 * @template TPersistence - Persistence model type
 * @template TDto - Data Transfer Object type
 */
export interface IMapper<TDomain, TPersistence, TDto = any> {
  /**
   * Convert from persistence model to domain entity
   * @param persistence - Persistence model data
   * @returns Domain entity
   */
  toDomain(persistence: TPersistence): TDomain;

  /**
   * Convert from domain entity to persistence model
   * @param domain - Domain entity
   * @returns Persistence model data
   */
  toPersistence(domain: TDomain): Omit<TPersistence, 'id' | 'createdAt' | 'updatedAt'>;

  /**
   * Convert from domain entity to DTO
   * @param domain - Domain entity
   * @returns DTO
   */
  toDto(domain: TDomain): TDto;

  /**
   * Convert from DTO to domain entity (for creation)
   * @param dto - Data Transfer Object
   * @returns Domain entity (without generated fields)
   */
  fromDto(dto: TDto): Omit<TDomain, 'id' | 'createdAt' | 'updatedAt'>;
}

/**
 * Base mapper class with common functionality
 * Following Single Responsibility Principle (SRP) and Template Method Pattern
 * 
 * @template TDomain - Domain entity type
 * @template TPersistence - Persistence model type
 * @template TDto - Data Transfer Object type
 */
export abstract class BaseMapper<TDomain, TPersistence, TDto = any> 
  implements IMapper<TDomain, TPersistence, TDto> {

  /**
   * Convert from persistence model to domain entity
   * Template method - subclasses implement the specific mapping logic
   */
  abstract toDomain(persistence: TPersistence): TDomain;

  /**
   * Convert from domain entity to persistence model
   * Template method - subclasses implement the specific mapping logic
   */
  abstract toPersistence(domain: TDomain): Omit<TPersistence, 'id' | 'createdAt' | 'updatedAt'>;

  /**
   * Convert from domain entity to DTO
   * Template method - subclasses implement the specific mapping logic
   */
  abstract toDto(domain: TDomain): TDto;

  /**
   * Convert from DTO to domain entity (for creation)
   * Template method - subclasses implement the specific mapping logic
   */
  abstract fromDto(dto: TDto): Omit<TDomain, 'id' | 'createdAt' | 'updatedAt'>;

  /**
   * Batch convert from persistence models to domain entities
   * Following DRY principle
   */
  toDomainList(persistenceList: TPersistence[]): TDomain[] {
    return persistenceList.map(item => this.toDomain(item));
  }

  /**
   * Batch convert from domain entities to persistence models
   * Following DRY principle
   */
  toPersistenceList(domainList: TDomain[]): Omit<TPersistence, 'id' | 'createdAt' | 'updatedAt'>[] {
    return domainList.map(item => this.toPersistence(item));
  }

  /**
   * Batch convert from domain entities to DTOs
   * Following DRY principle
   */
  toDtoList(domainList: TDomain[]): TDto[] {
    return domainList.map(item => this.toDto(item));
  }

  /**
   * Batch convert from DTOs to domain entities
   * Following DRY principle
   */
  fromDtoList(dtoList: TDto[]): Omit<TDomain, 'id' | 'createdAt' | 'updatedAt'>[] {
    return dtoList.map(item => this.fromDto(item));
  }

  /**
   * Safe conversion with error handling
   * Following defensive programming principles
   */
  protected safeConvert<TInput, TOutput>(
    input: TInput | null | undefined,
    converter: (input: TInput) => TOutput,
    defaultValue?: TOutput
  ): TOutput | undefined {
    if (input === null || input === undefined) {
      return defaultValue;
    }
    
    try {
      return converter(input);
    } catch (error) {
      console.warn(`Mapper conversion failed:`, error);
      return defaultValue;
    }
  }

  /**
   * Validate that required fields are present
   * Following fail-fast principle
   */
  protected validateRequired<T>(
    obj: any,
    fields: (keyof T)[],
    entityName: string
  ): void {
    const missingFields = fields.filter(field => 
      obj[field] === null || obj[field] === undefined
    );

    if (missingFields.length > 0) {
      throw new Error(
        `Missing required fields in ${entityName}: ${missingFields.join(', ')}`
      );
    }
  }

  /**
   * Clean undefined values from object
   * Following clean code principles
   */
  protected cleanObject<T extends Record<string, any>>(obj: T): T {
    const cleaned = {} as T;
    
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        cleaned[key as keyof T] = value;
      }
    }
    
    return cleaned;
  }

  /**
   * Map audit fields (createdAt, updatedAt, deletedAt)
   * Following DRY principle
   */
  protected mapAuditFields(source: any): {
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
  } {
    return {
      createdAt: source.createdAt instanceof Date ? source.createdAt : new Date(source.createdAt),
      updatedAt: source.updatedAt instanceof Date ? source.updatedAt : new Date(source.updatedAt),
      deletedAt: source.deletedAt ? 
        (source.deletedAt instanceof Date ? source.deletedAt : new Date(source.deletedAt)) : 
        null
    };
  }
}

/**
 * Base mapper for entities with relations
 * Following Interface Segregation Principle (ISP)
 * 
 * @template TDomain - Domain entity type
 * @template TPersistence - Persistence model type
 * @template TDomainWithRelations - Domain entity with relations type
 * @template TDto - Data Transfer Object type
 */
export abstract class BaseRelationalMapper<
  TDomain, 
  TPersistence, 
  TDomainWithRelations, 
  TDto = any
> extends BaseMapper<TDomain, TPersistence, TDto> {

  /**
   * Convert from persistence model with relations to domain entity with relations
   * Template method - subclasses implement the specific mapping logic
   */
  abstract toDomainWithRelations(persistence: TPersistence & any): TDomainWithRelations;

  /**
   * Batch convert with relations
   * Following DRY principle
   */
  toDomainWithRelationsList(persistenceList: (TPersistence & any)[]): TDomainWithRelations[] {
    return persistenceList.map(item => this.toDomainWithRelations(item));
  }
} 