export class Department {
  private constructor(
    private readonly _id: number,
    private _name: string,
    private readonly _tenantId: string,
    private readonly _createdAt: Date,
    private _updatedAt: Date,
    private _deletedAt: Date | null = null,
  ) {}

  // Factory method to create new department
  static create(name: string, tenantId: string): Department {
    const now = new Date();
    return new Department(
      0, // ID will be set by repository
      name,
      tenantId,
      now,
      now,
      null,
    );
  }

  // Factory method to reconstitute from persistence
  static reconstitute(
    id: number,
    name: string,
    tenantId: string,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null = null,
  ): Department {
    return new Department(id, name, tenantId, createdAt, updatedAt, deletedAt);
  }

  // Getters
  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get tenantId(): string {
    return this._tenantId;
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

  get isDeleted(): boolean {
    return this._deletedAt !== null;
  }

  // Business methods
  updateName(newName: string): void {
    if (!newName || newName.trim().length === 0) {
      throw new Error('Department name cannot be empty');
    }

    if (newName.trim().length < 2) {
      throw new Error('Department name must be at least 2 characters long');
    }

    if (newName.trim().length > 255) {
      throw new Error('Department name cannot exceed 255 characters');
    }

    this._name = newName.trim();
    this._updatedAt = new Date();
  }

  markAsDeleted(): void {
    if (this.isDeleted) {
      throw new Error('Department is already deleted');
    }

    this._deletedAt = new Date();
    this._updatedAt = new Date();
  }

  restore(): void {
    if (!this.isDeleted) {
      throw new Error('Department is not deleted');
    }

    this._deletedAt = null;
    this._updatedAt = new Date();
  }

  // Domain validation
  equals(other: Department): boolean {
    return this._id === other._id && this._tenantId === other._tenantId;
  }

  // Convert to primitive for serialization
  toPrimitives() {
    return {
      id: this._id,
      name: this._name,
      tenantId: this._tenantId,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      deletedAt: this._deletedAt,
    };
  }
}
