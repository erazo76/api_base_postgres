import { Injectable } from "@nestjs/common";
import { IFilesUseCase } from "application/ports/UseCases/FilesUseCase/IFilesUseCase.interface";
import { ICloudinaryService } from "domain/services/cloudinary/ICloudinaryService.interface";
import { IFile } from "domain/services/cloudinary/IFile.interface";

@Injectable()
export class FilesUseCase implements IFilesUseCase {
  constructor(private cloudinaryService: ICloudinaryService) {}

  async uploadFile(file: IFile, bucket: string): Promise<any> {
    const fil = { fileUrl: "", fileName: "" };
    const files = await this.cloudinaryService.uploadFile(file, bucket);
    fil.fileUrl = files.secure_url;
    fil.fileName = files.public_id;
    return fil;
  }
}
