/**
 * File Manager - tenant.entity Entity
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */
export class TenantEntity {
  private constructor(
    private readonly _id: string,
    private readonly _name: string,
    private readonly _nit: string,
    private readonly _canSendEmail: boolean,
    private readonly _createdAt: Date,
    private readonly _updatedAt: Date,
    private readonly _deletedAt: Date | null = null,
  ) {}

  public static create(props: {
    id: string;
    name: string;
    nit: string;
    canSendEmail?: boolean;
  }): TenantEntity {
    const now = new Date();
    return new TenantEntity(
      props.id,
      props.name,
      props.nit,
      props.canSendEmail || false,
      now,
      now,
      null,
    );
  }

  public static fromPersistence(props: {
    id: string;
    name: string;
    nit: string;
    canSendEmail: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
  }): TenantEntity {
    return new TenantEntity(
      props.id,
      props.name,
      props.nit,
      props.canSendEmail,
      props.createdAt,
      props.updatedAt,
      props.deletedAt,
    );
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get nit(): string {
    return this._nit;
  }

  get canSendEmail(): boolean {
    return this._canSendEmail;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get deletedAt(): Date | null {
    return this._deletedAt;
  }

  // Business logic methods
  public isActive(): boolean {
    return this._deletedAt === null;
  }

  public isDeleted(): boolean {
    return this._deletedAt !== null;
  }

  public canPerformEmailOperations(): boolean {
    return this.isActive() && this._canSendEmail;
  }

  public enableEmailFeature(): TenantEntity {
    return new TenantEntity(
      this._id,
      this._name,
      this._nit,
      true,
      this._createdAt,
      new Date(),
      this._deletedAt,
    );
  }

  public disableEmailFeature(): TenantEntity {
    return new TenantEntity(
      this._id,
      this._name,
      this._nit,
      false,
      this._createdAt,
      new Date(),
      this._deletedAt,
    );
  }

  public markAsDeleted(): TenantEntity {
    return new TenantEntity(
      this._id,
      this._name,
      this._nit,
      this._canSendEmail,
      this._createdAt,
      new Date(),
      new Date(),
    );
  }

  public updateInfo(name: string, nit: string): TenantEntity {
    return new TenantEntity(
      this._id,
      name,
      nit,
      this._canSendEmail,
      this._createdAt,
      new Date(),
      this._deletedAt,
    );
  }
}
