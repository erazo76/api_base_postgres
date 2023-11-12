import { Injectable } from "@nestjs/common";
import { Page, PageOptions } from "infrastructure/common/page";
import { Purchases } from "infrastructure/database/mapper/Purchases.entity";
import { DeleteResult, UpdateResult } from "typeorm";

@Injectable()
export abstract class IPurchasesUseCase {
  abstract getPurchases(pageOpts: PageOptions): Promise<Page<Purchases>>;

  abstract getPurchaseById(id: string): Promise<Purchases>;

  abstract createPurchase(PurchaseModel: Purchases): Promise<Purchases>;

  abstract updatePurchase(PurchaseModel: Purchases): Promise<UpdateResult>;

  abstract deletePurchase(id: string): Promise<DeleteResult>;
}
