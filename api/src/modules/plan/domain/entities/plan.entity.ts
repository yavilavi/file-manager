export class Plan {
  id: number;
  name: string;
  description: string;
  storageSize: bigint;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  constructor(props: {
    name: string;
    description: string;
    storageSize: bigint;
    isActive?: boolean;
    deletedAt?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    Object.assign(this, {
      ...props,
      isActive: props.isActive ?? true,
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date(),
    });
  }
}
