import { Injectable } from "@nestjs/common";
import { IFile } from "./IFile.interface";
import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";

@Injectable()
export abstract class ICloudinaryService {
  abstract uploadFile(
    file: IFile,
    bucket: string
  ): Promise<UploadApiResponse | UploadApiErrorResponse>;
}
