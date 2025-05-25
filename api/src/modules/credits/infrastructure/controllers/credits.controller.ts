/**
 * File Manager - credits.controller Controller
 *
 * Original Author: Yilmer Avila (https://www.linkedin.com/in/yilmeravila/)
 * Project: File Manager
 * License: Contribution-Only License (COL)
 *
 * Created: 2024
 */
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CreditsService } from '../../application/services/credits.service';
import { PurchaseCreditsDto } from '../../application/dtos/purchase-credits.dto';
import { UseCreditsDto } from '../../application/dtos/use-credits.dto';
import { CompanyCreditsDto } from '../../application/dtos/company-credits.dto';
import { CreditTransactionDto } from '../../application/dtos/credit-transaction.dto';
import { Request } from 'express';
import { JwtAuthGuard, RequiredPermission } from '@modules/auth';

@Controller('credits')
@UseGuards(JwtAuthGuard)
export class CreditsController {
  constructor(private readonly creditsService: CreditsService) {}

  @Get()
  @RequiredPermission('credit:read')
  async getCompanyCredits(@Req() req: Request): Promise<CompanyCreditsDto> {
    const tenantId = req.user.data.tenantId;
    return this.creditsService.getCompanyCredits(tenantId);
  }

  @Post('purchase')
  @RequiredPermission('credit:purchase')
  async purchaseCredits(
    @Req() req: Request,
    @Body() purchaseDto: PurchaseCreditsDto,
  ): Promise<CompanyCreditsDto> {
    const tenantId = req.user.data.tenantId;
    return this.creditsService.purchaseCredits(tenantId, purchaseDto);
  }

  @Post('use')
  @RequiredPermission('credit:use')
  async useCredits(
    @Req() req: Request,
    @Body() useDto: UseCreditsDto,
  ): Promise<CompanyCreditsDto> {
    const tenantId = req.user.data.tenantId;
    return this.creditsService.useCredits(tenantId, useDto);
  }

  @Get('transactions')
  @RequiredPermission('credit:read')
  async getTransactionHistory(
    @Req() req: Request,
  ): Promise<CreditTransactionDto[]> {
    const tenantId = req.user.data.tenantId;
    return this.creditsService.getCreditTransactions(tenantId);
  }
}
