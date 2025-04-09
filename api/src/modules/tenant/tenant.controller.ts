import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { PrismaService } from '@libs/database/prisma/prisma.service';
import { IsPublic } from '@shared/decorators/is-public.decorator';

@Controller('tenant')
export class TenantController {
  constructor(private prisma: PrismaService) {}

  @IsPublic()
  @Get('check-subdomain')
  async checkSubdomain(@Query('subdomain') subdomain: string) {
    if (!subdomain) {
      return new BadRequestException('Subdomain is required');
    }
    const company = await this.prisma.client.company.findFirst({
      where: {
        tenantId: subdomain,
      },
      select: { tenantId: true },
    });
    if (company) {
      return { available: false };
    }
    return { available: true };
  }
}
