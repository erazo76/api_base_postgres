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
import { ProductsModule } from "./products.module";
import { IUsersRepository } from "application/ports/Repository/UsersRepository/IUsersRepository.interface";
import { UsersRepository } from "infrastructure/database/repositories/Users.repository";
import { IUsersUseCase } from "application/ports/UseCases/UsersUseCase/IUsersUseCase.interface";
import { UsersUseCase } from "application/use-cases/UsersUseCase/UsersUseCase";
import { UsersModule } from "./users.module";
import { MailModule } from "./mailer.module";

@Module({
  controllers: [PurchasesController],
  imports: [ProductsModule, UsersModule, MailModule],
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
      provide: IUsersRepository,
      useClass: UsersRepository,
    },
    {
      provide: IPurchasesUseCase,
      useClass: PurchasesUseCase,
    },
    {
      provide: IPurchaseDetailsUseCase,
      useClass: PurchaseDetailsUseCase,
    },
    {
      provide: IUsersUseCase,
      useClass: UsersUseCase,
    },
  ],
})
export class PurchasesModule {}
