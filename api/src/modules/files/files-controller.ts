import {
  Controller,
  Get,
  Post,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files-service';
import { Request as Req } from 'express';

@Controller('files')
export class FilesController {
  constructor(private filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File, @Request() req: Req) {
    if (!file) {
      throw new Error('No file received');
    }
    return this.filesService.uploadFile(file, req.tenantId, req.user.data.id);
  }

  @Get()
  getAllFiles(@Request() req: Req) {
    return this.filesService.getAllFiles(req.tenantId);
  }
}
