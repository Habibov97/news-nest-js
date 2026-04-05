import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';

@Module({
  imports: [],
  providers: [CloudinaryService],
})
export class CloudinaryModule {}
