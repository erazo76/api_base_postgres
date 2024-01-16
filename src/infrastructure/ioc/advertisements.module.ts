import { Module } from "@nestjs/common";
import { IAdvertisementsRepository } from "application/ports/Repository/AdvertisementsRepository/IAdvertisementsRepository.interface";
import { IAdvertisementsUseCase } from "application/ports/UseCases/AdvertisementsUseCase/IAdvertisementsUseCase.interface";
import { AdvertisementsUseCase } from "application/use-cases/AdvertisementsUseCase/AdvertisementsUseCase";
import { ICloudinaryService } from "domain/services/cloudinary/ICloudinaryService.interface";
import { CloudinaryProvider } from "domain/services/cloudinary/cloudinary.provider";
import { CloudinaryService } from "domain/services/cloudinary/cloudinary.service";
import { AdvertisementsRepository } from "infrastructure/database/repositories/Advertisements.repository";
import { AdvertisementsController } from "presentation/controllers/AdvertisementsController";

@Module({
  controllers: [AdvertisementsController],
  providers: [
    {
      provide: IAdvertisementsRepository,
      useClass: AdvertisementsRepository,
    },
    {
      provide: IAdvertisementsUseCase,
      useClass: AdvertisementsUseCase,
    },
    {
      provide: ICloudinaryService,
      useClass: CloudinaryService,
    },
    CloudinaryProvider,
  ],
  exports: [
    {
      provide: IAdvertisementsUseCase,
      useClass: AdvertisementsUseCase,
    },
  ],
})
export class AdvertisementsModule {}
