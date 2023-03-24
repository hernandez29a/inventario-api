import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FilesService {
  getStaticFile(imageName: string) {
    const path = join(__dirname, '../../src/static/products', imageName);
    if (!existsSync) {
      throw new BadRequestException(
        `No hay productos con la imagen ${imageName}`,
      );
    }
    return path;
  }
}
