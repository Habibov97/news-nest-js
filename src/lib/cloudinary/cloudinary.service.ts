import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadFile(file: Express.Multer.File) {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(file, (err, result) => {
          if (err) return reject(err);
          resolve(result);
        })
        .end(file);
    });

    return result;
  }
}
