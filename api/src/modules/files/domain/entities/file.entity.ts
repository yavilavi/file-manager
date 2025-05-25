/**
 * File Manager - file.entity Entity
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
export class FileEntity {
  private constructor(
    private readonly _id: number,
    private readonly _name: string,
    private readonly _extension: string,
    private readonly _mimeType: string,
    private readonly _hash: string,
    private readonly _size: number,
    private readonly _path: string,
    private readonly _documentType: string | null,
    private readonly _tenantId: string,
    private readonly _userId: number,
    private readonly _createdAt: Date,
    private readonly _updatedAt: Date,
    private readonly _deletedAt: Date | null = null,
  ) {}

  public static create(props: {
    name: string;
    extension: string;
    mimeType: string;
    hash: string;
    size: number;
    path: string;
    documentType?: string | null;
    tenantId: string;
    userId: number;
  }): FileEntity {
    const now = new Date();
    return new FileEntity(
      0, // Will be set by database
      props.name,
      props.extension,
      props.mimeType,
      props.hash,
      props.size,
      props.path,
      props.documentType || null,
      props.tenantId,
      props.userId,
      now,
      now,
      null,
    );
  }

  public static fromPersistence(props: {
    id: number;
    name: string;
    extension: string;
    mimeType: string;
    hash: string;
    size: number;
    path: string;
    documentType: string | null;
    tenantId: string;
    userId: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
  }): FileEntity {
    return new FileEntity(
      props.id,
      props.name,
      props.extension,
      props.mimeType,
      props.hash,
      props.size,
      props.path,
      props.documentType,
      props.tenantId,
      props.userId,
      props.createdAt,
      props.updatedAt,
      props.deletedAt,
    );
  }

  // Getters
  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get extension(): string {
    return this._extension;
  }

  get mimeType(): string {
    return this._mimeType;
  }

  get hash(): string {
    return this._hash;
  }

  get size(): number {
    return this._size;
  }

  get path(): string {
    return this._path;
  }

  get documentType(): string | null {
    return this._documentType;
  }

  get tenantId(): string {
    return this._tenantId;
  }

  get userId(): number {
    return this._userId;
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
  public isDeleted(): boolean {
    return this._deletedAt !== null;
  }

  public belongsToTenant(tenantId: string): boolean {
    return this._tenantId === tenantId;
  }

  public belongsToUser(userId: number): boolean {
    return this._userId === userId;
  }

  public isEditable(): boolean {
    const editableTypes = ['word', 'cell', 'slide'];
    return editableTypes.includes(this._documentType || '');
  }

  public updateHash(newHash: string): FileEntity {
    return new FileEntity(
      this._id,
      this._name,
      this._extension,
      this._mimeType,
      newHash,
      this._size,
      this._path,
      this._documentType,
      this._tenantId,
      this._userId,
      this._createdAt,
      new Date(),
      this._deletedAt,
    );
  }

  public markAsDeleted(): FileEntity {
    return new FileEntity(
      this._id,
      this._name,
      this._extension,
      this._mimeType,
      this._hash,
      this._size,
      this._path,
      this._documentType,
      this._tenantId,
      this._userId,
      this._createdAt,
      new Date(),
      new Date(),
    );
  }
}
