import {
  Controller,
  Delete,
  Get,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Request,
  Response,
  StreamableFile,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request as Req, Response as Res } from 'express';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadInterface } from '@shared/interfaces/jwt-payload.interface';
import { IsPublic } from '@shared/decorators/is-public.decorator';

// Use Cases
import { UploadFileUseCase } from '../application/use-cases/upload-file.use-case';
import { DownloadFileUseCase } from '../application/use-cases/download-file.use-case';
import { GetFileByIdUseCase } from '../application/use-cases/get-file-by-id.use-case';
import { GetAllFilesUseCase } from '../application/use-cases/get-all-files.use-case';
import { DeleteFileUseCase } from '../application/use-cases/delete-file.use-case';

// DTOs
import {
  UploadFileDto,
  FileUploadResultDto,
} from '../application/dtos/upload-file.dto';
import { DownloadFileDto } from '../application/dtos/download-file.dto';

@Controller('files')
export class FilesController {
  constructor(
    private readonly uploadFileUseCase: UploadFileUseCase,
    private readonly downloadFileUseCase: DownloadFileUseCase,
    private readonly getFileByIdUseCase: GetFileByIdUseCase,
    private readonly getAllFilesUseCase: GetAllFilesUseCase,
    private readonly deleteFileUseCase: DeleteFileUseCase,
    private readonly jwtService: JwtService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: Req,
  ): Promise<FileUploadResultDto> {
    if (!file) {
      throw new Error('No file received');
    }

    const uploadDto = new UploadFileDto({
      originalname: file.originalname,
      buffer: file.buffer,
      mimetype: file.mimetype,
      size: file.size,
      tenantId: req.tenantId,
      userId: req.user.data.id,
    });

    return await this.uploadFileUseCase.execute(uploadDto);
  }

  @Get()
  async getAllFiles(@Request() req: Req) {
    return await this.getAllFilesUseCase.execute(req.tenantId);
  }

  @Get(':id')
  async getFileById(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: Req,
  ) {
    return await this.getFileByIdUseCase.execute(id, req.tenantId);
  }

  @Get(':id/download')
  async downloadFile(
    @Param('id', ParseIntPipe) id: number,
    @Query('tenantId') tenantId: string,
    @Query('versionId') versionId: string | undefined,
    @Response({ passthrough: true }) res: Res,
  ) {
    try {
      const downloadDto = new DownloadFileDto({
        id,
        tenantId,
        versionId,
      });

      const { stream, contentType, fileName } =
        await this.downloadFileUseCase.execute(downloadDto);

      res.setHeader('Content-Type', contentType);
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${fileName}"`,
      );
      res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');

      return new StreamableFile(stream, {
        type: contentType,
        disposition: `attachment; filename="${fileName}"`,
      });
    } catch (err: unknown) {
      Logger.error(err);
      throw new NotFoundException('Archivo no encontrado o no disponible');
    }
  }

  @Delete(':id')
  async deleteFile(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: Req,
  ): Promise<void> {
    await this.deleteFileUseCase.execute(id, req.tenantId);
  }

  @IsPublic()
  @Get('get-edit-url/:fileId')
  async getEditUrl(
    @Param('fileId') fileId: number,
    @Query('token') token: string,
    @Query('tenantId') tenantId: string,
    @Query('versionId') versionId: string | undefined,
  ) {
    try {
      this.jwtService.verify<JwtPayloadInterface>(token);

      const downloadDto = new DownloadFileDto({
        id: fileId,
        tenantId,
        versionId,
      });

      const { stream, contentType, fileName } =
        await this.downloadFileUseCase.execute(downloadDto);

      return new StreamableFile(stream, {
        type: contentType,
        disposition: `attachment; filename="${fileName}"`,
      });
    } catch (e) {
      Logger.error(e);
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }

  // TODO: Editor functionality will be moved to a separate module in the future
}
