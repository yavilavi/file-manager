import {
  Controller,
  Delete,
  Get,
  Logger,
  MaxFileSizeValidator,
  NotFoundException,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Post,
  Query,
  Request,
  Response,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files-service';
import { Request as Req, Response as Res } from 'express';

@Controller('files')
export class FilesController {
  constructor(private filesService: FilesService) {}

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
    @Response({ passthrough: true }) res: Res,
  ) {
    try {
      const { stream, contentType, fileName } =
        await this.filesService.downloadFile(id, tenantId);

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
}
