import { Injectable } from "@nestjs/common";
import { IPurchasesRepository } from "application/ports/Repository/PurchasesRepository/IPurchasesRepository.interface";
import { IPurchaseDetailsUseCase } from "application/ports/UseCases/PurchaseDetailsUseCase/IPurchaseDetailsUseCase.interface";
import { IPurchasesUseCase } from "application/ports/UseCases/PurchasesUseCase/IPurchasesUseCase.interface";
import { Page, PageMeta, PageOptions } from "infrastructure/common/page";
import { Purchases } from "infrastructure/database/mapper/Purchases.entity";
import { DeleteResult, UpdateResult } from "typeorm";

@Injectable()
export class PurchasesUseCase implements IPurchasesUseCase {
  constructor(
    private readonly purchasesRepo: IPurchasesRepository,
    private readonly purchaseDetail: IPurchaseDetailsUseCase
  ) {}

  async getPurchases(pageOpts: PageOptions): Promise<Page<Purchases>> {
    const [purchases, count] = await this.purchasesRepo.findAndCount({
      skip: pageOpts.page - 1,
      take: pageOpts.take,
      relations: ["buyer", "prDetail", "prDetail.seller", "prDetail.product"],
    });
    const pageMeta = new PageMeta(pageOpts, count);
    return new Page(purchases, pageMeta);
  }

  async getPurchaseById(id: string): Promise<Purchases> {
    try {
      return await this.purchasesRepo.findOne({
        id: id,
        relations: ["buyer", "prDetail", "prDetail.seller", "prDetail.product"],
        select: ["id", "status", "total", "createdAt"],
      });
    } catch (error) {
      console.log(error);
    }
  }

  async calculateTotal(purchaseId: string): Promise<number> {
    const detail = await this.purchaseDetail.getPurchaseDetailByPurchaseId(
      purchaseId
    );

    const total = detail.reduce((init, ended) => init + ended.subtotal, 0);
    let model = new Purchases();
    model.id = purchaseId;
    model.total = total;
    await this.updatePurchase(model);
    return total;
  }

  async createPurchase(moduleModel: Purchases): Promise<Purchases> {
    console.log(moduleModel);
    return await this.purchasesRepo.save(moduleModel);
  }

  updatePurchase(moduleModel: Purchases): Promise<UpdateResult> {
    return this.purchasesRepo.update(moduleModel.id, moduleModel);
  }

  deletePurchase(id: string): Promise<DeleteResult> {
    return this.purchasesRepo.delete(id);
  }
}
