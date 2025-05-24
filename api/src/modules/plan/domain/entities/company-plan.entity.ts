import { Plan } from './plan.entity';

export class CompanyPlan {
  id: number;
  tenantId: string;
  planId: number;
  startDate: Date;
  endDate: Date | null;
  isActive: boolean;
  storageUsed: bigint;
  createdAt: Date;
  updatedAt: Date;
  plan?: Plan;

  constructor(props: {
    tenantId: string;
    planId: number;
    startDate?: Date;
    endDate?: Date | null;
    isActive?: boolean;
    storageUsed?: bigint;
    createdAt?: Date;
    updatedAt?: Date;
    plan?: Plan;
  }) {
    Object.assign(this, {
      ...props,
      startDate: props.startDate || new Date(),
      isActive: props.isActive ?? true,
      storageUsed: props.storageUsed || BigInt(0),
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date(),
    });
  }
}
