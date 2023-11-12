import { Injectable } from "@nestjs/common";
import { Purchases } from "infrastructure/database/mapper/Purchases.entity";
import { IRepository } from "../IRepository.interface";

@Injectable()
export abstract class IPurchasesRepository extends IRepository<Purchases> {}
