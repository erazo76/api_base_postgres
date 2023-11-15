import { Module } from "@nestjs/common";
import { IProductsRepository } from "application/ports/Repository/ProductsRepository/IProductsRepository.interface";
import { IProductsUseCase } from "application/ports/UseCases/ProductsUseCase/IProductsUseCase.interface";
import { ProductsUseCase } from "application/use-cases/ProductsUseCase/ProductsUseCase";

import { ProductsRepository } from "infrastructure/database/repositories/Products.repository";
import { ProductsController } from "presentation/controllers/ProductsController";

@Module({
  controllers: [ProductsController],
  providers: [
    {
      provide: IProductsRepository,
      useClass: ProductsRepository,
    },
    {
      provide: IProductsUseCase,
      useClass: ProductsUseCase,
    },
  ],
  exports: [
    {
      provide: IProductsUseCase,
      useClass: ProductsUseCase,
    },
  ],
})
export class ProductsModule {}
