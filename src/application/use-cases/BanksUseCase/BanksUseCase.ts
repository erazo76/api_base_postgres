import { Injectable } from "@nestjs/common";
import { IBanksRepository } from "application/ports/Repository/BanksRepository/IBanksRepository.interface";
import { IBanksUseCase } from "application/ports/UseCases/BanksUseCase/IBanksUseCase.interface";
import { ICloudinaryService } from "domain/services/cloudinary/ICloudinaryService.interface";
import { IFile } from "domain/services/cloudinary/IFile.interface";
import { Page, PageMeta, PageOptions } from "infrastructure/common/page";
import { Banks } from "infrastructure/database/mapper/Banks.entity";
import { DeleteResult, UpdateResult } from "typeorm";
import { Cron } from "@nestjs/schedule";
import { FirestoreService } from "domain/services/firebase/firestore.service";

@Injectable()
export class BanksUseCase implements IBanksUseCase {
  constructor(
    private readonly banksRepo: IBanksRepository,
    private readonly cloudinaryService: ICloudinaryService,
    private readonly firestoreService: FirestoreService
  ) {}

  async getBanks(pageOpts: PageOptions): Promise<Page<Banks>> {
    try {
      const [banks, count] = await this.banksRepo.findAndCount({
        skip: (pageOpts.page - 1) * pageOpts.take,
        take: pageOpts.take,
      });
      const pageMeta = new PageMeta(pageOpts, count);
      return new Page(banks, pageMeta);
    } catch (error) {
      console.log(error);
    }
  }

  getBankById(id: string): Promise<Banks> {
    return this.banksRepo.findOne({
      where: { id },
    });
  }

  getBankByName(name: string): Promise<Banks> {
    return this.banksRepo.findOne({ where: [{ name: name }] });
  }

  async createBank(file: IFile, moduleModel: Banks): Promise<Banks> {
    moduleModel.urlImage = await this.uploadFile(file, "");
    return this.banksRepo.save(moduleModel);
  }

  async updateBank(file: IFile, moduleModel: Banks): Promise<UpdateResult> {
    if (file) {
      moduleModel.urlImage = await this.uploadFile(file, "");
    }

    return this.banksRepo.update(moduleModel.id, moduleModel);
  }

  deleteBank(id: string): Promise<DeleteResult> {
    return this.banksRepo.delete(id);
  }

  async uploadFile(file: IFile, bucket: string): Promise<any> {
    const files = await this.cloudinaryService.uploadFile(file, bucket);
    return files.secure_url;
  }

  @Cron("0 0 * * *")
  private async deleteChatsDocuemnts(): Promise<void> {
    try {
      const chatsCollection = await this.firestoreService.getCollection(
        "chats"
      );
      const snapshot = await chatsCollection.get();

      snapshot.docs.forEach(async (doc) => {
        await doc.ref.delete();
      });

      console.log("Chats collection cleaned successfully");
    } catch (error) {
      console.error("Error cleaning chats collection:", error);
    }
  }
}
