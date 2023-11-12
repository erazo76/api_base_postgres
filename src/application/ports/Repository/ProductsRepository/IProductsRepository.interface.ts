import { Injectable } from "@nestjs/common";
import { Products } from "infrastructure/database/mapper/Products.entity";
import { IRepository } from "../IRepository.interface";

@Injectable()
export abstract class IProductsRepository extends IRepository<Products> {}
