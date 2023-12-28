import { Injectable } from "@nestjs/common";
import { Page, PageOptions } from "infrastructure/common/page";
import { PurchaseDetails } from "infrastructure/database/mapper/PurchaseDetails.entity";
import { DeleteResult, UpdateResult } from "typeorm";

@Injectable()
export abstract class IPurchaseDetailsUseCase {
  abstract getPurchaseDetails(
    pageOpts: PageOptions,
    active: boolean,
    startDate: string,
    endDate: string
  ): Promise<Page<PurchaseDetails>>;

  abstract getPurchaseDetailById(id: string): Promise<PurchaseDetails>;

  abstract getPurchaseDetailByPurchaseId(
    id: string
  ): Promise<PurchaseDetails[]>;

  abstract createPurchaseDetail(
    PurchaseDetailModel: PurchaseDetails
  ): Promise<PurchaseDetails>;

  abstract updatePurchaseDetail(
    PurchaseDetailModel: PurchaseDetails
  ): Promise<UpdateResult>;

  abstract deletePurchaseDetail(id: string): Promise<DeleteResult>;

  abstract deleteLogicPurchaseDetail(purchaseId: string): Promise<void>;
}
