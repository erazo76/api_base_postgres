import { Injectable } from "@nestjs/common";
import { IPurchasesRepository } from "application/ports/Repository/PurchasesRepository/IPurchasesRepository.interface";
import { IPurchaseDetailsUseCase } from "application/ports/UseCases/PurchaseDetailsUseCase/IPurchaseDetailsUseCase.interface";
import { IPurchasesUseCase } from "application/ports/UseCases/PurchasesUseCase/IPurchasesUseCase.interface";
import { Page, PageMeta, PageOptions } from "infrastructure/common/page";
import { PurchaseDetails } from "infrastructure/database/mapper/PurchaseDetails.entity";
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
      relations: ["buyer", "prDetail", "prDetail.seller"],
    });
    const pageMeta = new PageMeta(pageOpts, count);
    return new Page(purchases, pageMeta);
  }

  async getPurchaseById(id: string): Promise<Purchases> {
    try {
      return await this.purchasesRepo.findOne({
        id: id,
        relations: ["buyer"],
        select: ["id", "status", "total", "createdAt"],
      });
    } catch (error) {
      console.log(error);
    }
  }

  async createPurchase(moduleModel: Purchases): Promise<Purchases> {
    console.log(moduleModel);

    const purchase = await this.purchasesRepo.save(moduleModel);

    purchase.prDetail.forEach((detail) => {
      detail.id = purchase.id;
    });

    // Guardar los detalles de compra actualizados
    await Promise.all(
      purchase.prDetail.map(async (e) => {
        await this.purchaseDetail.createPurchaseDetail(e);
      })
    );

    // Calcular el total y actualizar la compra
    purchase.total = this.calculateDetail(purchase.prDetail);
    await this.purchasesRepo.save(purchase);

    return purchase;
  }

  calculateDetail(datum: PurchaseDetails[]): number {
    return datum.reduce((alpha, beta) => alpha + beta.subtotal, 0);
  }

  updatePurchase(moduleModel: Purchases): Promise<UpdateResult> {
    return this.purchasesRepo.update(moduleModel.id, moduleModel);
  }

  deletePurchase(id: string): Promise<DeleteResult> {
    return this.purchasesRepo.delete(id);
  }
}
