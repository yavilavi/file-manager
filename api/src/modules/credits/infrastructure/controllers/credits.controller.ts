import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CreditsService } from '../../application/services/credits.service';
import { PurchaseCreditsDto } from '../../application/dtos/purchase-credits.dto';
import { UseCreditsDto } from '../../application/dtos/use-credits.dto';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth/jwt-auth.guard';
import { RequirePermission } from '@modules/auth/decorators/require-permission.decorator';
import { CompanyCreditsDto } from '../../application/dtos/company-credits.dto';
import { CreditTransactionDto } from '../../application/dtos/credit-transaction.dto';
import { Request } from 'express';

@Controller('credits')
@UseGuards(JwtAuthGuard)
export class CreditsController {
  constructor(private readonly creditsService: CreditsService) {}

  @Get()
  @RequirePermission('credit:read')
  async getCompanyCredits(@Req() req: Request): Promise<CompanyCreditsDto> {
    const tenantId = req.user.data.tenantId;
    return this.creditsService.getCompanyCredits(tenantId);
  }

  @Post('purchase')
  @RequirePermission('credit:purchase')
  async purchaseCredits(
    @Req() req: Request,
    @Body() purchaseDto: PurchaseCreditsDto,
  ): Promise<CompanyCreditsDto> {
    const tenantId = req.user.data.tenantId;
    return this.creditsService.purchaseCredits(tenantId, purchaseDto);
  }

  @Post('use')
  @RequirePermission('credit:use')
  async useCredits(
    @Req() req: Request,
    @Body() useDto: UseCreditsDto,
  ): Promise<CompanyCreditsDto> {
    const tenantId = req.user.data.tenantId;
    return this.creditsService.useCredits(tenantId, useDto);
  }

  @Get('transactions')
  @RequirePermission('credit:read')
  async getTransactionHistory(
    @Req() req: Request,
  ): Promise<CreditTransactionDto[]> {
    const tenantId = req.user.data.tenantId;
    return this.creditsService.getTransactionHistory(tenantId);
  }
}
