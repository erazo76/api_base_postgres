import { Injectable } from "@nestjs/common";
import { IPurchasesRepository } from "application/ports/Repository/PurchasesRepository/IPurchasesRepository.interface";
import { IPurchaseDetailsUseCase } from "application/ports/UseCases/PurchaseDetailsUseCase/IPurchaseDetailsUseCase.interface";
import { IPurchasesUseCase } from "application/ports/UseCases/PurchasesUseCase/IPurchasesUseCase.interface";
import { Page, PageMeta, PageOptions } from "infrastructure/common/page";
import { Purchases } from "infrastructure/database/mapper/Purchases.entity";
import { Between, DeleteResult, UpdateResult } from "typeorm";

@Injectable()
export class PurchasesUseCase implements IPurchasesUseCase {
  constructor(
    private readonly purchasesRepo: IPurchasesRepository,
    private readonly purchaseDetail: IPurchaseDetailsUseCase
  ) {}

  async getPurchases(
    pageOpts: PageOptions,
    roling: Array<string>,
    status: string,
    startDate: string,
    endDate: string
  ): Promise<Page<Purchases>> {
    try {
      const stat: any = {};
      if (status) {
        stat.status = status;
      }

      if (startDate && endDate) {
        stat.createdAt = Between(startDate, endDate);
      }

      if (roling[0] === "CLIENT") {
        stat.buyer = roling[1];
      }
      const [purchases, count] = await this.purchasesRepo.findAndCount({
        where: [stat],
        skip: (pageOpts.page - 1) * pageOpts.take,
        take: pageOpts.take,
        relations: ["buyer", "prDetail", "prDetail.seller", "prDetail.product"],
      });
      const pageMeta = new PageMeta(pageOpts, count);
      return new Page(purchases, pageMeta);
    } catch (error) {
      console.log(error);
    }
  }

  async getPurchaseById(id: string): Promise<Purchases> {
    try {
      return await this.purchasesRepo.findOne({
        where: { id },
        relations: ["buyer", "prDetail", "prDetail.seller", "prDetail.product"],
        select: ["id", "status", "total", "createdAt"],
      });
    } catch (error) {
      console.log(error);
    }
  }

  async getPurchaseByIdBase(id: string): Promise<Purchases> {
    try {
      return await this.purchasesRepo.findOne({
        where: { id },
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
    model.total = Math.round(total * 100) / 100;
    await this.updatePurchase(model);
    return Math.round(total * 100) / 100;
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
