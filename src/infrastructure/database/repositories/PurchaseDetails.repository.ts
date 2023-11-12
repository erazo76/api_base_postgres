import { Injectable } from "@nestjs/common";
import { InjectConnection } from "@nestjs/typeorm";
import { IPurchaseDetailsRepository } from "application/ports/Repository/PurchaseDetailsRepository/IPurchaseDetailsRepository.interface";
import { Connection } from "typeorm";
import { PurchaseDetails } from "../mapper/PurchaseDetails.entity";
import { BaseRepository } from "./Base.repository";

@Injectable()
export class PurchaseDetailsRepository extends BaseRepository<PurchaseDetails>
  implements IPurchaseDetailsRepository {
  constructor(@InjectConnection() connection: Connection) {
    super(connection, PurchaseDetails);
  }
}
