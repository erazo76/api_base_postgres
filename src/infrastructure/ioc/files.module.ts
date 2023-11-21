import { Module } from "@nestjs/common";
import { IFilesUseCase } from "application/ports/UseCases/FilesUseCase/IFilesUseCase.interface";
import { FilesUseCase } from "application/use-cases/FilesUseCase/FilesUseCase";
import { ICloudinaryService } from "domain/services/cloudinary/ICloudinaryService.interface";
import { CloudinaryProvider } from "domain/services/cloudinary/cloudinary.provider";
import { CloudinaryService } from "domain/services/cloudinary/cloudinary.service";
import { FilesController } from "presentation/controllers/FilesController";

@Module({
  controllers: [FilesController],
  providers: [
    {
      provide: IFilesUseCase,
      useClass: FilesUseCase,
    },
    {
      provide: ICloudinaryService,
      useClass: CloudinaryService,
    },
    CloudinaryProvider,
  ],
})
export class FilesModule {}
