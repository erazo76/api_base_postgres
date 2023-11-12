import { Injectable } from "@nestjs/common";
import { InjectConnection } from "@nestjs/typeorm";
import { IPurchasesRepository } from "application/ports/Repository/PurchasesRepository/IPurchasesRepository.interface";
import { Connection } from "typeorm";
import { Purchases } from "../mapper/Purchases.entity";
import { BaseRepository } from "./Base.repository";

@Injectable()
export class PurchasesRepository extends BaseRepository<Purchases>
  implements IPurchasesRepository {
  constructor(@InjectConnection() connection: Connection) {
    super(connection, Purchases);
  }
}
