import { Injectable } from "@nestjs/common";
import { PurchaseDetails } from "infrastructure/database/mapper/PurchaseDetails.entity";
import { IRepository } from "../IRepository.interface";

@Injectable()
export abstract class IPurchaseDetailsRepository extends IRepository<
  PurchaseDetails
> {}
