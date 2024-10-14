import { Module } from "@nestjs/common";
import { IBanksRepository } from "application/ports/Repository/BanksRepository/IBanksRepository.interface";
import { IBanksUseCase } from "application/ports/UseCases/BanksUseCase/IBanksUseCase.interface";
import { BanksUseCase } from "application/use-cases/BanksUseCase/BanksUseCase";
import { ICloudinaryService } from "domain/services/cloudinary/ICloudinaryService.interface";
import { CloudinaryProvider } from "domain/services/cloudinary/cloudinary.provider";
import { CloudinaryService } from "domain/services/cloudinary/cloudinary.service";
import { FirestoreService } from "domain/services/firebase/firestore.service";
import { BanksRepository } from "infrastructure/database/repositories/Banks.repository";
import { BanksController } from "presentation/controllers/BanksController";

@Module({
  controllers: [BanksController],
  providers: [
    FirestoreService,
    {
      provide: IBanksRepository,
      useClass: BanksRepository,
    },
    {
      provide: IBanksUseCase,
      useClass: BanksUseCase,
    },
    {
      provide: ICloudinaryService,
      useClass: CloudinaryService,
    },
    CloudinaryProvider,
  ],
  exports: [
    {
      provide: IBanksUseCase,
      useClass: BanksUseCase,
    },
  ],
})
export class BanksModule {}
