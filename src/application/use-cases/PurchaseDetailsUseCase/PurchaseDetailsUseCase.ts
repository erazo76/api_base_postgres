import { Injectable } from "@nestjs/common";
import { IPurchaseDetailsRepository } from "application/ports/Repository/PurchaseDetailsRepository/IPurchaseDetailsRepository.interface";
import { IPurchaseDetailsUseCase } from "application/ports/UseCases/PurchaseDetailsUseCase/IPurchaseDetailsUseCase.interface";
import { Page, PageMeta, PageOptions } from "infrastructure/common/page";
import { Products } from "infrastructure/database/mapper/Products.entity";
import { PurchaseDetails } from "infrastructure/database/mapper/PurchaseDetails.entity";

import { DeleteResult, UpdateResult } from "typeorm";

@Injectable()
export class PurchaseDetailsUseCase implements IPurchaseDetailsUseCase {
  constructor(
    private readonly purchaseDetailsRepo: IPurchaseDetailsRepository
  ) {}

  async getPurchaseDetails(
    pageOpts: PageOptions
  ): Promise<Page<PurchaseDetails>> {
    const [purchases, count] = await this.purchaseDetailsRepo.findAndCount({
      skip: pageOpts.page - 1,
      take: pageOpts.take,
      relations: ["detail", "seller", "product"],
    });
    const pageMeta = new PageMeta(pageOpts, count);
    return new Page(purchases, pageMeta);
  }

  async getPurchaseDetailById(id: string): Promise<PurchaseDetails> {
    try {
      return await this.purchaseDetailsRepo.findOne({
        id: id,
        relations: ["detail", "seller", "product"],
      });
    } catch (error) {
      console.log(error);
    }
  }

  createPurchaseDetail(moduleModel: PurchaseDetails): Promise<PurchaseDetails> {
    console.log(moduleModel);
    console.log(moduleModel.product.price);
    moduleModel.subtotal = this.calculatedSubtotal(
      moduleModel.product,
      moduleModel.quantity
    );
    return this.purchaseDetailsRepo.save(moduleModel);
  }

  calculatedSubtotal(datum: Products, qty: number) {
    return datum.price * qty;
  }

  updatePurchaseDetail(moduleModel: PurchaseDetails): Promise<UpdateResult> {
    return this.purchaseDetailsRepo.update(moduleModel.id, moduleModel);
  }

  deletePurchaseDetail(id: string): Promise<DeleteResult> {
    return this.purchaseDetailsRepo.delete(id);
  }
}
