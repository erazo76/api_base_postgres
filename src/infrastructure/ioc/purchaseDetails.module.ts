import { Module } from "@nestjs/common";
import { IPurchaseDetailsRepository } from "application/ports/Repository/PurchaseDetailsRepository/IPurchaseDetailsRepository.interface";
import { IPurchaseDetailsUseCase } from "application/ports/UseCases/PurchaseDetailsUseCase/IPurchaseDetailsUseCase.interface";
import { PurchaseDetailsUseCase } from "application/use-cases/PurchaseDetailsUseCase/PurchaseDetailsUseCase";
import { PurchaseDetailsRepository } from "infrastructure/database/repositories/PurchaseDetails.repository";
import { PurchaseDetailsController } from "presentation/controllers/PurchaseDetailsController";

@Module({
  controllers: [PurchaseDetailsController],
  providers: [
    {
      provide: IPurchaseDetailsRepository,
      useClass: PurchaseDetailsRepository,
    },
    {
      provide: IPurchaseDetailsUseCase,
      useClass: PurchaseDetailsUseCase,
    },
  ],
  exports: [
    {
      provide: IPurchaseDetailsUseCase,
      useClass: PurchaseDetailsUseCase,
    },
  ],
})
export class PurchaseDetailsModule {}
