import { Module } from "@nestjs/common";
import { IPurchasesRepository } from "application/ports/Repository/PurchasesRepository/IPurchasesRepository.interface";
import { IPurchasesUseCase } from "application/ports/UseCases/PurchasesUseCase/IPurchasesUseCase.interface";
import { PurchasesUseCase } from "application/use-cases/PurchasesUseCase/PurchasesUseCase";
import { PurchasesRepository } from "infrastructure/database/repositories/Purchases.repository";
import { PurchasesController } from "presentation/controllers/PurchasesController";
import { IPurchaseDetailsRepository } from "application/ports/Repository/PurchaseDetailsRepository/IPurchaseDetailsRepository.interface";
import { PurchaseDetailsRepository } from "infrastructure/database/repositories/PurchaseDetails.repository";
import { IPurchaseDetailsUseCase } from "application/ports/UseCases/PurchaseDetailsUseCase/IPurchaseDetailsUseCase.interface";
import { PurchaseDetailsUseCase } from "application/use-cases/PurchaseDetailsUseCase/PurchaseDetailsUseCase";

@Module({
  controllers: [PurchasesController],
  providers: [
    {
      provide: IPurchasesRepository,
      useClass: PurchasesRepository,
    },
    {
      provide: IPurchaseDetailsRepository,
      useClass: PurchaseDetailsRepository,
    },
    {
      provide: IPurchasesUseCase,
      useClass: PurchasesUseCase,
    },
    {
      provide: IPurchaseDetailsUseCase,
      useClass: PurchaseDetailsUseCase,
    },
  ],
})
export class PurchasesModule {}
