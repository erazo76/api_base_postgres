import { Injectable } from "@nestjs/common";
import { Banks } from "infrastructure/database/mapper/Banks.entity";
import { IRepository } from "../IRepository.interface";

@Injectable()
export abstract class IBanksRepository extends IRepository<Banks> {}
