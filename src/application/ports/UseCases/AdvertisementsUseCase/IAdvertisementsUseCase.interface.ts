import { Injectable } from "@nestjs/common";
import { IFile } from "domain/services/cloudinary/IFile.interface";
import { Page, PageOptions } from "infrastructure/common/page";
import { Advertisements } from "infrastructure/database/mapper/Advertisements.entity";
import { DeleteResult, UpdateResult } from "typeorm";

@Injectable()
export abstract class IAdvertisementsUseCase {
  abstract getAdvertisements(
    pageOpts: PageOptions
  ): Promise<Page<Advertisements>>;

  abstract getAdvertisementById(id: string): Promise<Advertisements>;

  abstract getAdvertisementByTitle(title: string): Promise<Advertisements>;

  abstract createAdvertisement(
    file: IFile,
    AdvertisementModel: Advertisements
  ): Promise<Advertisements>;

  abstract updateAdvertisement(
    file: IFile,
    AdvertisementModel: Advertisements
  ): Promise<UpdateResult>;

  abstract deleteAdvertisement(id: string): Promise<DeleteResult>;
}
