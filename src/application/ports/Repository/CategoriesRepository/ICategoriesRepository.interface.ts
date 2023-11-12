import { Injectable } from "@nestjs/common";
import { Categories } from "infrastructure/database/mapper/Categories.entity";
import { IRepository } from "../IRepository.interface";

@Injectable()
export abstract class ICategoriesRepository extends IRepository<Categories> {}
