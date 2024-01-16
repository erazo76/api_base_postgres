import { Injectable } from "@nestjs/common";
import { InjectConnection } from "@nestjs/typeorm";
import { IAdvertisementsRepository } from "application/ports/Repository/AdvertisementsRepository/IAdvertisementsRepository.interface";
import { Connection } from "typeorm";
import { Advertisements } from "../mapper/Advertisements.entity";
import { BaseRepository } from "./Base.repository";

@Injectable()
export class AdvertisementsRepository extends BaseRepository<Advertisements>
  implements IAdvertisementsRepository {
  constructor(@InjectConnection() connection: Connection) {
    super(connection, Advertisements);
  }
}
