import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
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
import { FilesService } from './files-service.old';
import { Request as Req, Response as Res } from 'express';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadInterface } from '@shared/interfaces/jwt-payload.interface';
import { IsPublic } from '@shared/decorators/is-public.decorator';

@Controller('files')
export class FilesController {
  constructor(
    private filesService: FilesService,
    private jwtService: JwtService,
  ) {}

  /**
   * Get all versions of a file
   */
  @Get(':id/versions')
  getFileVersions(@Param('id', ParseIntPipe) id: number, @Request() req: Req) {
    return this.filesService.getFileVersions(id, req.tenantId);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile()
    file: Express.Multer.File,
    @Request() req: Req,
  ) {
    if (!file) {
      throw new Error('No file received');
    }
    return this.filesService.uploadFile(file, req.tenantId, req.user.data.id);
  }

  @Get()
  getAllFiles(@Request() req: Req) {
    return this.filesService.getAllFiles(req.tenantId);
  }

  @Get(':id/download')
  async downloadFile(
    @Param('id', ParseIntPipe) id: number,
    @Query('tenantId') tenantId: string,
    @Query('versionId') versionId: string | undefined,
    @Response({ passthrough: true }) res: Res,
  ) {
    try {
      const { stream, contentType, fileName } =
        await this.filesService.downloadFile(id, tenantId, versionId);

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

  @Get(':id')
  getFileById(@Param('id', ParseIntPipe) id: number, @Request() req: Req) {
    return this.filesService.getFileById(id, req.tenantId);
  }

  @Delete(':id')
  async deleteFile(@Param('id', ParseIntPipe) id: number, @Request() req: Req) {
    return this.filesService.deleteFile(id, req.tenantId);
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
      const { stream, contentType, fileName } =
        await this.filesService.downloadFile(fileId, tenantId, versionId);
      return new StreamableFile(stream, {
        type: contentType,
        disposition: `attachment; filename="${fileName}"`,
      });
    } catch (e) {
      Logger.error(e);
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }

  @Get(':id/editor-url')
  async getEditorUrl(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: Req,
  ) {
    const { id: userId, name } = req.user.data;
    const tenantId = req.tenantId;
    const token = req.headers['authorization']?.split(' ')[1] as string;

    return this.filesService.generateEditorConfig(
      id,
      userId,
      req.user.department?.name ?? 'Sin departamento',
      name,
      tenantId,
      token,
    );
  }

  @IsPublic()
  @HttpCode(HttpStatus.OK)
  @Post('changes-callback/:fileId')
  async handleChanges(
    @Param('fileId') fileId: number,
    @Query('token') token: string,
    @Query('tenantId') tenantId: string,
    @Body() body: { status: number; url: string; key: string; users: string[] },
  ) {
    try {
      this.jwtService.verify<JwtPayloadInterface>(token);
      // Validate the callback key matches the expected format
      const expectedKey = `${tenantId}_${fileId}`;
      if (body.key !== expectedKey) {
        Logger.error(
          `Invalid callback key for file ${fileId}. Expected: ${expectedKey}, Received: ${body.key}`,
        );
        return JSON.stringify({ error: 1 });
      }
      const downloadUrl: string = body.url;
      Logger.debug(body, 'Changes callback body');

      // Handle different callback statuses
      switch (body.status) {
        case 0: // Document is being edited
          Logger.log(
            `Document ${fileId} is being edited by users: ${body.users.join(', ')}`,
          );
          // No action needed, document is just being edited
          break;

        case 1: // Document is ready for saving
          Logger.log(`Document ${fileId} is ready for saving`);
          // Document is ready but not yet saved, no action needed
          break;

        case 2:
          Logger.error(`Error saving document ${fileId}`);
          await this.filesService.saveEditedFile(fileId, downloadUrl, tenantId);
          break;

        case 3: // Document is closed with no changes
          Logger.log(`Document ${fileId} was closed with no changes`);
          // No action needed as no changes were made
          break;

        case 4: // Document is being edited, but the current document state is saved
          Logger.log(`Document ${fileId} state was saved`);
          // Document state was saved but editing continues, no action needed
          break;

        case 6: // Document is being edited, but the current document state is saved by timeout
          Logger.log(`Document ${fileId} was saved by timeout`);
          await this.filesService.saveEditedFile(fileId, downloadUrl, tenantId);
          break;

        case 7: // Document editing error has occurred
          Logger.error(`Error editing document ${fileId}`);
          // Return error as this is a critical error that prevents saving
          return JSON.stringify({ error: 1 });

        default:
          Logger.warn(
            `Unknown callback status ${body.status} for document ${fileId}`,
          );
        // For unknown statuses, we don't take any action but log a warning
      }

      return JSON.stringify({ error: 0 });
    } catch (error) {
      Logger.error(
        `Error handling OnlyOffice callback for file ${fileId}: ${(error as Error).message}`,
      );
      return JSON.stringify({ error: 1 });
    }
  }
}
