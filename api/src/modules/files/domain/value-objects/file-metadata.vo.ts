export class FileMetadata {
  private constructor(
    private readonly _name: string,
    private readonly _extension: string,
    private readonly _mimeType: string,
    private readonly _size: number,
  ) {}

  public static create(props: {
    name: string;
    extension: string;
    mimeType: string;
    size: number;
  }): FileMetadata {
    // Validation
    if (!props.name || props.name.trim().length === 0) {
      throw new Error('File name cannot be empty');
    }

    if (!props.extension || props.extension.trim().length === 0) {
      throw new Error('File extension cannot be empty');
    }

    if (!props.mimeType || props.mimeType.trim().length === 0) {
      throw new Error('File MIME type cannot be empty');
    }

    if (props.size <= 0) {
      throw new Error('File size must be greater than zero');
    }

    if (props.size > 100 * 1024 * 1024) {
      // 100MB limit
      throw new Error('File size cannot exceed 100MB');
    }

    const sanitizedName = props.name.replace(/[_-]/g, ' ').trim();

    return new FileMetadata(
      sanitizedName,
      props.extension.toLowerCase(),
      props.mimeType,
      props.size,
    );
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

  get size(): number {
    return this._size;
  }

  public getSizeInMB(): number {
    return this._size / (1024 * 1024);
  }

  public getSizeInKB(): number {
    return this._size / 1024;
  }

  public isImage(): boolean {
    return this._mimeType.startsWith('image/');
  }

  public isDocument(): boolean {
    const documentMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ];
    return documentMimeTypes.includes(this._mimeType);
  }

  public isVideo(): boolean {
    return this._mimeType.startsWith('video/');
  }

  public isAudio(): boolean {
    return this._mimeType.startsWith('audio/');
  }
}
