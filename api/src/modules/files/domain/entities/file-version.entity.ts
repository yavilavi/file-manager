/**
 * File Manager - file-version.entity Entity
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */
export class FileVersionEntity {
  private constructor(
    private readonly _id: string,
    private readonly _name: string,
    private readonly _hash: string,
    private readonly _size: number,
    private readonly _fileId: number,
    private readonly _isLast: boolean,
    private readonly _createdAt: Date,
    private readonly _updatedAt: Date,
    private readonly _deletedAt: Date | null = null,
  ) {}

  public static create(props: {
    id: string;
    name: string;
    hash: string;
    size: number;
    fileId: number;
    isLast?: boolean;
  }): FileVersionEntity {
    const now = new Date();
    return new FileVersionEntity(
      props.id,
      props.name,
      props.hash,
      props.size,
      props.fileId,
      props.isLast ?? true,
      now,
      now,
      null,
    );
  }

  public static fromPersistence(props: {
    id: string;
    name: string;
    hash: string;
    size: number;
    fileId: number;
    isLast: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
  }): FileVersionEntity {
    return new FileVersionEntity(
      props.id,
      props.name,
      props.hash,
      props.size,
      props.fileId,
      props.isLast,
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

  get hash(): string {
    return this._hash;
  }

  get size(): number {
    return this._size;
  }

  get fileId(): number {
    return this._fileId;
  }

  get isLast(): boolean {
    return this._isLast;
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

  public belongsToFile(fileId: number): boolean {
    return this._fileId === fileId;
  }

  public markAsNotLast(): FileVersionEntity {
    return new FileVersionEntity(
      this._id,
      this._name,
      this._hash,
      this._size,
      this._fileId,
      false,
      this._createdAt,
      new Date(),
      this._deletedAt,
    );
  }

  public markAsDeleted(): FileVersionEntity {
    return new FileVersionEntity(
      this._id,
      this._name,
      this._hash,
      this._size,
      this._fileId,
      this._isLast,
      this._createdAt,
      new Date(),
      new Date(),
    );
  }
}
