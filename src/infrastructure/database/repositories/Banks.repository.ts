import { Injectable } from "@nestjs/common";
import { InjectConnection } from "@nestjs/typeorm";
import { IBanksRepository } from "application/ports/Repository/BanksRepository/IBanksRepository.interface";
import { Connection } from "typeorm";
import { Banks } from "../mapper/Banks.entity";
import { BaseRepository } from "./Base.repository";

@Injectable()
export class BanksRepository extends BaseRepository<Banks>
  implements IBanksRepository {
  constructor(@InjectConnection() connection: Connection) {
    super(connection, Banks);
  }
}
