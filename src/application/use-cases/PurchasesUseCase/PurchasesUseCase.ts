import { Injectable } from "@nestjs/common";
import { IPurchasesRepository } from "application/ports/Repository/PurchasesRepository/IPurchasesRepository.interface";
import { IPurchaseDetailsUseCase } from "application/ports/UseCases/PurchaseDetailsUseCase/IPurchaseDetailsUseCase.interface";
import { IPurchasesUseCase } from "application/ports/UseCases/PurchasesUseCase/IPurchasesUseCase.interface";
import { IUsersUseCase } from "application/ports/UseCases/UsersUseCase/IUsersUseCase.interface";
import { Page, PageMeta, PageOptions } from "infrastructure/common/page";
import { Purchases } from "infrastructure/database/mapper/Purchases.entity";
import { Between, DeleteResult, ILike, UpdateResult } from "typeorm";

@Injectable()
export class PurchasesUseCase implements IPurchasesUseCase {
  constructor(
    private readonly purchasesRepo: IPurchasesRepository,
    private readonly purchaseDetail: IPurchaseDetailsUseCase,
    private readonly datauser: IUsersUseCase
  ) {}

  async getPurchases(
    pageOpts: PageOptions,
    search: string,
    roling: Array<string>,
    status: string,
    startDate: string,
    endDate: string,
    buyerId: string
  ): Promise<Page<Purchases>> {
    try {
      const stat: any = {};
      if (status) {
        stat.status = status;
      }

      if (startDate && endDate) {
        const localStartDate = new Date(`${startDate}T00:00:00`);
        const localEndDate = new Date(`${endDate}T23:59:59`);

        const start = new Date(localStartDate.toUTCString());
        const end = new Date(localEndDate.toUTCString());
        stat.createdAt = Between(start, end);
      }

      if (roling[0] === "CLIENT") {
        stat.buyer = roling[1];
      }

      if (search) {
        stat.buyer = {
          name: ILike(`%${search}%`),
        };
      }
      if (buyerId) {
        stat.buyer = {
          id: buyerId,
          active: true, // Puedes dejar esta línea si es necesario, dependiendo de tus requerimientos
        };
      } else {
        stat.buyer = {
          active: true,
        };
      }

      const [purchases, count] = await this.purchasesRepo.findAndCount({
        where: [stat],
        skip: (pageOpts.page - 1) * pageOpts.take,
        take: pageOpts.take,
        relations: ["buyer", "prDetail", "prDetail.seller", "prDetail.product"],
      });
      const pageMeta = new PageMeta(pageOpts, count);
      return new Page(purchases, pageMeta);
    } catch (error) {
      console.log(error);
    }
  }

  async getPurchaseById(id: string): Promise<Purchases> {
    try {
      return await this.purchasesRepo.findOne({
        where: { id },
        relations: ["buyer", "prDetail", "prDetail.seller", "prDetail.product"],
        select: ["id", "status", "total", "note", "paymented", "createdAt"],
      });
    } catch (error) {
      console.log(error);
    }
  }

  async getPurchaseByIdBase(id: string): Promise<Purchases> {
    try {
      return await this.purchasesRepo.findOne({
        where: { id },
      });
    } catch (error) {
      console.log(error);
    }
  }

  async calculateTotal(purchaseId: string): Promise<number> {
    const detail = await this.purchaseDetail.getPurchaseDetailByPurchaseId(
      purchaseId
    );

    const filteredDetails = detail.filter((detal) => {
      return detal.product && detal.product.name !== "DOMICILIO";
    });

    const total = filteredDetails.reduce(
      (init, ended) => init + ended.subtotal,
      0
    );
    let model = new Purchases();
    model.id = purchaseId;
    model.total = Math.round(total * 100) / 100;
    await this.updatePurchase(model);
    return Math.round(total * 100) / 100;
  }

  async createPurchase(moduleModel: Purchases): Promise<Purchases> {
    return await this.purchasesRepo.save(moduleModel);
  }

  async updatePurchase(moduleModel: Purchases): Promise<UpdateResult> {
    const { id, status, total } = moduleModel;
    const purchase = await this.getPurchaseById(id);
    const buyer = purchase.buyer.id;
    const pointsToAdd = Math.ceil(total / 1000);
    console.log(status, purchase, pointsToAdd * -1, buyer);
    if (status === "CANCELED") {
      await this.purchaseDetail.deleteLogicPurchaseDetail(id);
      if (purchase.paymented === true) {
        await this.datauser.addPoint(buyer, pointsToAdd * -1);
      }
    }
    if (status === "REQUESTED") {
      await this.datauser.addPoint(buyer, pointsToAdd);
    }
    return this.purchasesRepo.update(id, moduleModel);
  }

  deletePurchase(id: string): Promise<DeleteResult> {
    return this.purchasesRepo.delete(id);
  }
}
