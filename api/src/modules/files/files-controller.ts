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
import { FilesService } from './files-service';
import { Request as Req, Response as Res } from 'express';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadInterface } from '@shared/interfaces/jwt-payload.interface';
import { IsPublic } from '@shared/decorators/is-public.decorator';
import * as console from 'node:console';

@Controller('files')
export class FilesController {
  constructor(
    private filesService: FilesService,
    private jwtService: JwtService,
  ) {}

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

  @IsPublic()
  @Get('get-edit-url/:fileId')
  async getEditUrl(
    @Param('fileId') fileId: number,
    @Query('token') token: string,
    @Query('tenantId') tenantId: string,
    // @Response() res: Res,
  ) {
    try {
      this.jwtService.verify<JwtPayloadInterface>(token);
      const { stream, contentType, fileName } =
        await this.filesService.downloadFile(fileId, tenantId);
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
    @Body() body: { status: number; url: string },
  ) {
    this.jwtService.verify<JwtPayloadInterface>(token);
    if (body.status === 2 || body.status === 6) {
      const downloadUrl: string = body.url;
      // Aquí descargas y guardas el archivo actualizado
      await this.filesService.saveEditedFile(fileId, downloadUrl, tenantId);
    }
    return JSON.stringify({ error: 0 });
  }
}
