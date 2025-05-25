/**
 * File Manager - plan-repository.interface Interface
 * 
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 * 
 * Created: 2024
 */
import { Plan } from '../entities/plan.entity';

export const PLAN_REPOSITORY = 'PLAN_REPOSITORY';

export interface IPlanRepository {
  findAll(): Promise<Plan[]>;

  findById(id: number): Promise<Plan | null>;

  findByName(name: string): Promise<Plan | null>;

  findActive(): Promise<Plan[]>;

  create(plan: Plan): Promise<Plan>;

  update(id: number, plan: Partial<Plan>): Promise<Plan>;

  softDelete(id: number): Promise<void>;

  hardDelete(id: number): Promise<void>;
}
