import { Injectable } from "@nestjs/common";
import { IAdvertisementsRepository } from "application/ports/Repository/AdvertisementsRepository/IAdvertisementsRepository.interface";
import { IAdvertisementsUseCase } from "application/ports/UseCases/AdvertisementsUseCase/IAdvertisementsUseCase.interface";
import { ICloudinaryService } from "domain/services/cloudinary/ICloudinaryService.interface";
import { IFile } from "domain/services/cloudinary/IFile.interface";
import { Page, PageMeta, PageOptions } from "infrastructure/common/page";
import { Advertisements } from "infrastructure/database/mapper/Advertisements.entity";
import { DeleteResult, UpdateResult } from "typeorm";

@Injectable()
export class AdvertisementsUseCase implements IAdvertisementsUseCase {
  constructor(
    private readonly advertisementsRepo: IAdvertisementsRepository,
    private cloudinaryService: ICloudinaryService
  ) {}

  async getAdvertisements(
    pageOpts: PageOptions
  ): Promise<Page<Advertisements>> {
    try {
      const [
        advertisements,
        count,
      ] = await this.advertisementsRepo.findAndCount({
        skip: (pageOpts.page - 1) * pageOpts.take,
        take: pageOpts.take,
      });
      const pageMeta = new PageMeta(pageOpts, count);
      return new Page(advertisements, pageMeta);
    } catch (error) {
      console.log(error);
    }
  }

  getAdvertisementById(id: string): Promise<Advertisements> {
    return this.advertisementsRepo.findOne({
      where: { id },
    });
  }

  getAdvertisementByTitle(title: string): Promise<Advertisements> {
    return this.advertisementsRepo.findOne({ where: [{ title: title }] });
  }

  async createAdvertisement(
    file: IFile,
    moduleModel: Advertisements
  ): Promise<Advertisements> {
    moduleModel.urlImage = await this.uploadFile(file, "");
    return this.advertisementsRepo.save(moduleModel);
  }

  async updateAdvertisement(
    file: IFile,
    moduleModel: Advertisements
  ): Promise<UpdateResult> {
    moduleModel.urlImage = await this.uploadFile(file, "");
    return this.advertisementsRepo.update(moduleModel.id, moduleModel);
  }

  deleteAdvertisement(id: string): Promise<DeleteResult> {
    return this.advertisementsRepo.delete(id);
  }

  async uploadFile(file: IFile, bucket: string): Promise<any> {
    const files = await this.cloudinaryService.uploadFile(file, bucket);
    return files.secure_url;
  }
}
