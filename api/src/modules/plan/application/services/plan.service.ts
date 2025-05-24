import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import {
  IPlanRepository,
  PLAN_REPOSITORY,
} from '../../domain/repositories/plan-repository.interface';
import { Plan } from '../../domain/entities/plan.entity';
import { CreatePlanDto } from '../dtos/create-plan.dto';
import { UpdatePlanDto } from '../dtos/update-plan.dto';

@Injectable()
export class PlanService {
  constructor(
    @Inject(PLAN_REPOSITORY)
    private readonly planRepository: IPlanRepository,
  ) {}

  async findAll(): Promise<Plan[]> {
    return this.planRepository.findAll();
  }

  async findById(id: number): Promise<Plan> {
    const plan = await this.planRepository.findById(id);
    if (!plan) {
      throw new NotFoundException(`Plan with ID ${id} not found`);
    }
    return plan;
  }

  async findByName(name: string): Promise<Plan> {
    const plan = await this.planRepository.findByName(name);
    if (!plan) {
      throw new NotFoundException(`Plan with name ${name} not found`);
    }
    return plan;
  }

  async findActive(): Promise<Plan[]> {
    return this.planRepository.findActive();
  }

  async create(createPlanDto: CreatePlanDto): Promise<Plan> {
    const plan = new Plan({
      name: createPlanDto.name,
      description: createPlanDto.description,
      storageSize: BigInt(createPlanDto.storageSize),
      isActive: createPlanDto.isActive ?? true,
    });

    return this.planRepository.create(plan);
  }

  async update(id: number, updatePlanDto: UpdatePlanDto): Promise<Plan> {
    // Check if plan exists
    await this.findById(id);

    // Create update data object with the correct types
    const updateData: Partial<Plan> = {};

    if (updatePlanDto.name) updateData.name = updatePlanDto.name;
    if (updatePlanDto.description)
      updateData.description = updatePlanDto.description;
    if (updatePlanDto.storageSize)
      updateData.storageSize = BigInt(updatePlanDto.storageSize);
    if (updatePlanDto.isActive !== undefined)
      updateData.isActive = updatePlanDto.isActive;

    return this.planRepository.update(id, updateData);
  }

  async delete(id: number): Promise<void> {
    // Check if plan exists
    await this.findById(id);

    return this.planRepository.softDelete(id);
  }
}
