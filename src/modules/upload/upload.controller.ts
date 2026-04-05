import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guards';
import { Roles } from 'src/shared/decorator/role.decorator';
import { UserRole } from '../user/user.types';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as crypto from 'crypto';
import {
  ALLOWED_IMAGE_EXTENSIONS,
  ALLOWED_IMAGE_MIME_TYPES,
} from './upload.types';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileUploadDto } from './dto/upload-file.dto';
import { UploadService } from './upload.service';

@Controller('upload')
@UseGuards(AuthGuard)
@Roles(UserRole.ADMIN, UserRole.CONTENT_MANAGER)
@ApiBearerAuth()
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: FileUploadDto,
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: join(__dirname, '../../../uploads'),
        filename(req, file, cb) {
          const ext = extname(file.originalname);
          const fileName = crypto.randomBytes(36).toString('hex');
          cb(null, `${fileName}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        const ext = extname(file.originalname).toLowerCase();
        const mimeType = file.mimetype;

        if (
          !ALLOWED_IMAGE_EXTENSIONS.includes(ext) ||
          !ALLOWED_IMAGE_MIME_TYPES.includes(mimeType)
        ) {
          return cb(new BadRequestException('Invalid file type'), false);
        }

        cb(null, true);
      },
      limits: {
        fileSize: 5e6,
      },
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return {
      message: 'File has been uploaded',
      url: `/uploads/${file.filename}`,
    };
  }

  @Post('cloud')
  uploadFileCloud() {}
}
