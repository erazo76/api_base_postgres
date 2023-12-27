import { Module } from "@nestjs/common";
import { IPurchaseDetailsRepository } from "application/ports/Repository/PurchaseDetailsRepository/IPurchaseDetailsRepository.interface";
import { IPurchasesRepository } from "application/ports/Repository/PurchasesRepository/IPurchasesRepository.interface";
import { IPurchaseDetailsUseCase } from "application/ports/UseCases/PurchaseDetailsUseCase/IPurchaseDetailsUseCase.interface";
import { IPurchasesUseCase } from "application/ports/UseCases/PurchasesUseCase/IPurchasesUseCase.interface";
import { PurchaseDetailsUseCase } from "application/use-cases/PurchaseDetailsUseCase/PurchaseDetailsUseCase";
import { PurchasesUseCase } from "application/use-cases/PurchasesUseCase/PurchasesUseCase";
import { PurchaseDetailsRepository } from "infrastructure/database/repositories/PurchaseDetails.repository";
import { PurchasesRepository } from "infrastructure/database/repositories/Purchases.repository";
import { SSEController } from "presentation/controllers/SseController";

@Module({
  controllers: [SSEController],
  imports: [],
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
export class SseModule {}
