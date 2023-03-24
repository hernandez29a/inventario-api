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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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

  @Post('products')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 1000000 },
      storage: diskStorage({
        destination: './src/static/products',
        filename: fileNamer,
      }),
    }),
  )
  uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|gif)' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    /*const dataFile = {
      fieldname: file.fieldname,
      originalname: file.originalname,
      encoding: file.encoding,
      mimetype: file.mimetype,
    }; */
    console.log(file);
    // ? nombre de la imagen guardada en el servidor
    // ? falta guardar este dato en la base de datos
    const secureUrl = `${this.configService.get('HOST_ENV')}/files/products/${
      file.filename
    }`;
    return secureUrl;
  }
}
