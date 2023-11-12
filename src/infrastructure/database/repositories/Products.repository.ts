import { Injectable } from "@nestjs/common";
import { InjectConnection } from "@nestjs/typeorm";
import { IProductsRepository } from "application/ports/Repository/ProductsRepository/IProductsRepository.interface";
import { Connection } from "typeorm";
import { Products } from "../mapper/Products.entity";
import { BaseRepository } from "./Base.repository";

@Injectable()
export class ProductsRepository extends BaseRepository<Products>
  implements IProductsRepository {
  constructor(@InjectConnection() connection: Connection) {
    super(connection, Products);
  }
}
