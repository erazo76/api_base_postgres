import { Injectable } from "@nestjs/common";
import { Advertisements } from "infrastructure/database/mapper/Advertisements.entity";
import { IRepository } from "../IRepository.interface";

@Injectable()
export abstract class IAdvertisementsRepository extends IRepository<
  Advertisements
> {}
