import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { CloudinaryModule } from 'src/lib/cloudinary/cloudinary.module';

@Module({
  imports: [CloudinaryModule],
  controllers: [UploadController],
  providers: [],
})
export class UploadModule {}
