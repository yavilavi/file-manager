/**
 * File Manager - Company Creation Use Case
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */

import { Injectable, Inject, ConflictException } from '@nestjs/common';
import {
  ICompanyRepository,
  COMPANY_REPOSITORY,
  ICreateCompanyData,
  ICompanyWithRelations,
} from '@shared/interfaces/company-repository.interface';

export interface CreateCompanyCommand {
  name: string;
  nit: string;
  tenantId: string;
  departments: Array<{ name: string }>;
}

export interface CompanyCreationResult {
  company: ICompanyWithRelations;
  departments: Array<{ id: number; name: string }>;
}

/**
 * Company Creation Use Case
 * Following Single Responsibility Principle (SRP) - only handles company creation
 * Following Dependency Inversion Principle (DIP) - depends on abstractions
 */
@Injectable()
export class CompanyCreationUseCase {
  constructor(
    @Inject(COMPANY_REPOSITORY)
    private readonly companyRepository: ICompanyRepository,
  ) {}

  /**
   * Create a new company with departments
   * @param command - Company creation data
   * @returns Promise with created company and departments
   */
  async execute(command: CreateCompanyCommand): Promise<CompanyCreationResult> {
    const { name, nit, tenantId, departments } = command;

    // Check if company with NIT already exists
    const existingCompany = await this.companyRepository.findByNit(nit);

    if (existingCompany) {
      throw new ConflictException(
        'Ya hay una compañía registrada con este NIT',
      );
    }

    // Create company data
    const companyData: ICreateCompanyData = {
      name,
      nit,
      tenantId,
      canSendEmail: false, // Default value
      departments: departments.map((dept) => ({ name: dept.name })),
    };

    // Create company with departments
    const createdCompany =
      await this.companyRepository.createCompanyWithDepartments(companyData);

    return {
      company: createdCompany,
      departments: createdCompany.departments || [],
    };
  }
}
