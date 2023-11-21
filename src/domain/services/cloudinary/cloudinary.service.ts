import { Injectable, Logger } from "@nestjs/common";
import { ICloudinaryService } from "./ICloudinaryService.interface";
import { ConfigService } from "@nestjs/config";
import { IFile } from "./IFile.interface";
import { parse } from "path";
import sharp from "sharp";
import {
  v2 as cloudinary,
  UploadApiErrorResponse,
  UploadApiResponse,
} from "cloudinary";
import toStream = require("buffer-to-stream");

@Injectable()
export class CloudinaryService implements ICloudinaryService {
  constructor(private configService: ConfigService) {}

  logger: Logger = new Logger("CloudinaryService");

  private setFilename(uploadedFile: IFile): string {
    const fileName = parse(uploadedFile.originalname);
    return `${fileName.name}-${Date.now()}`
      .replace(/^[./]+/g, "")
      .replace(/[\r\n]/g, "_")
      .replace(/\s+/g, "_");
  }

  private resizeFile(uploadedFile: IFile) {
    return sharp(uploadedFile.buffer)
      .resize(300)
      .webp({ effort: 3 })
      .toBuffer();
  }

  public async uploadFile(
    file: IFile,
    bucket: string
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    this.logger.log("Upload File");
    const name = this.setFilename(file);
    const fila = await this.resizeFile(file);
    file.filename = name;
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          public_id: `${name}`,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      toStream(fila).pipe(uploadStream);
    });
  }
}
