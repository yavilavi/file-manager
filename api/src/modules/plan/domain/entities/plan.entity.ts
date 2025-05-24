export class Plan {
  id: number;
  name: string;
  description: string;
  storageSize: bigint;
  creditsIncluded: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  constructor(props: {
    name: string;
    description: string;
    storageSize: bigint;
    creditsIncluded?: number;
    isActive?: boolean;
    deletedAt?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    Object.assign(this, {
      ...props,
      creditsIncluded: props.creditsIncluded ?? 0,
      isActive: props.isActive ?? true,
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date(),
    });
  }
}
