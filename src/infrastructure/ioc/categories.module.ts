import { Module } from "@nestjs/common";
import { ICategoriesRepository } from "application/ports/Repository/CategoriesRepository/ICategoriesRepository.interface";
import { ICategoriesUseCase } from "application/ports/UseCases/CategoriesUseCase/ICategoriesUseCase.interface";
import { CategoriesUseCase } from "application/use-cases/CategoriesUseCase/CategoriesUseCase";

import { CategoriesRepository } from "infrastructure/database/repositories/Categories.repository";
import { CategoriesController } from "presentation/controllers/CategoriesController";

@Module({
  controllers: [CategoriesController],
  providers: [
    {
      provide: ICategoriesUseCase,
      useClass: CategoriesUseCase,
    },
    {
      provide: ICategoriesRepository,
      useClass: CategoriesRepository,
    },
  ],
  exports: [
    {
      provide: ICategoriesUseCase,
      useClass: CategoriesUseCase,
    },
  ],
})
export class CategoriesModule {}
