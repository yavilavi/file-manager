import { Injectable } from '@nestjs/common';
import { PrismaService } from '@libs/database/prisma/prisma.service';
import { IPlanRepository } from '../../domain/repositories/plan-repository.interface';
import { Plan, Plan as PlanEntity } from '../../domain/entities/plan.entity';
import { Plan as PrismaPlan } from '@prisma/client';

@Injectable()
export class PrismaPlanRepository implements IPlanRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toDomainEntity(prismaPlan: PrismaPlan): PlanEntity {
    const plan = new PlanEntity({
      name: prismaPlan.name,
      description: prismaPlan.description,
      storageSize: prismaPlan.storageSize,
      isActive: prismaPlan.isActive,
      createdAt: prismaPlan.createdAt,
      updatedAt: prismaPlan.updatedAt,
      deletedAt: prismaPlan.deletedAt,
    });

    plan.id = prismaPlan.id;
    return plan;
  }

  private toPrismaEntity(plan: Plan): Omit<PrismaPlan, 'id'> {
    return {
      name: plan.name,
      description: plan.description,
      storageSize: plan.storageSize,
      isActive: plan.isActive,
      createdAt: plan.createdAt,
      updatedAt: plan.updatedAt,
      deletedAt: plan.deletedAt,
    };
  }

  async findAll(): Promise<PlanEntity[]> {
    const plans = await this.prisma.client.plan.findMany({
      where: { deletedAt: null },
      orderBy: { name: 'asc' },
    });

    return plans.map((plan: PlanEntity) => this.toDomainEntity(plan));
  }

  async findById(id: number): Promise<Plan | null> {
    const plan = await this.prisma.client.plan.findUnique({
      where: { id },
    });

    return plan ? this.toDomainEntity(plan) : null;
  }

  async findByName(name: string): Promise<Plan | null> {
    const plan = await this.prisma.client.plan.findUnique({
      where: { name },
    });

    return plan ? this.toDomainEntity(plan) : null;
  }

  async findActive(): Promise<Plan[]> {
    const plans = await this.prisma.client.plan.findMany({
      where: {
        isActive: true,
        deletedAt: null,
      },
      orderBy: { name: 'asc' },
    });

    return plans.map((plan: PlanEntity) => this.toDomainEntity(plan));
  }

  async create(plan: Plan): Promise<Plan> {
    const createdPlan = await this.prisma.client.plan.create({
      data: this.toPrismaEntity(plan),
    });

    return this.toDomainEntity(createdPlan);
  }

  async update(id: number, plan: Partial<Plan>): Promise<Plan> {
    const updatedPlan = await this.prisma.client.plan.update({
      where: { id },
      data: {
        ...plan,
        updatedAt: new Date(),
      },
    });

    return this.toDomainEntity(updatedPlan);
  }

  async softDelete(id: number): Promise<void> {
    await this.prisma.client.plan.update({
      where: { id },
      data: {
        isActive: false,
        deletedAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  async hardDelete(id: number): Promise<void> {
    await this.prisma.client.plan.delete({
      where: { id },
    });
  }
}
