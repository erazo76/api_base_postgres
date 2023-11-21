import { Injectable } from "@nestjs/common";
import { IFile } from "domain/services/cloudinary/IFile.interface";

@Injectable()
export abstract class IFilesUseCase {
  abstract uploadFile(file: IFile, bucket: string): Promise<any>;
}
