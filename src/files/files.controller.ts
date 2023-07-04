import {
  Controller,
  Get,
  Post,
  UseInterceptors,
  UploadedFile,
  FileTypeValidator,
  ParseFilePipe,
  Param,
  Res,
  UploadedFiles,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FilesService } from './files.service';
import { fileNamer } from '../common/helper/fileNamer.helper';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Archivos')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}

  @Get('products/:imageName')
  findFile(@Res() res: Response, @Param('imageName') imageName: string) {
    const path = this.filesService.getStaticFile(imageName);
    res.sendFile(path);
    //return path;
  }

  // ? subir un arreglo de archivos
  @Post('products/:id')
  @UseInterceptors(
    FilesInterceptor('files', 3, {
      limits: { fileSize: 1000000 },
      storage: diskStorage({
        destination: './src/static/products',
        filename: fileNamer,
      }),
    }),
  )
  async uploadFiles(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|gif)' }),
        ],
      }),
    )
    files: Array<Express.Multer.File>,
  ) {
    //console.log(files);
    const images = files.map((file) => file.filename);
    return this.filesService.updateFile(id, images);
  }
}
