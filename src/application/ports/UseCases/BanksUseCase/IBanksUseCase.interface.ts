import { Injectable } from "@nestjs/common";
import { IFile } from "domain/services/cloudinary/IFile.interface";
import { Page, PageOptions } from "infrastructure/common/page";
import { Banks } from "infrastructure/database/mapper/Banks.entity";
import { DeleteResult, UpdateResult } from "typeorm";

@Injectable()
export abstract class IBanksUseCase {
  abstract getBanks(pageOpts: PageOptions): Promise<Page<Banks>>;

  abstract getBankById(id: string): Promise<Banks>;

  abstract getBankByName(name: string): Promise<Banks>;

  abstract createBank(file: IFile, BankModel: Banks): Promise<Banks>;

  abstract updateBank(file: IFile, BankModel: Banks): Promise<UpdateResult>;

  abstract deleteBank(id: string): Promise<DeleteResult>;
}
