import { Injectable } from "@nestjs/common";
import { InjectConnection } from "@nestjs/typeorm";
import { ICategoriesRepository } from "application/ports/Repository/CategoriesRepository/ICategoriesRepository.interface";
import { Connection } from "typeorm";
import { Categories } from "../mapper/Categories.entity";
import { BaseRepository } from "./Base.repository";

@Injectable()
export class CategoriesRepository extends BaseRepository<Categories>
  implements ICategoriesRepository {
  constructor(@InjectConnection() connection: Connection) {
    super(connection, Categories);
  }
}
