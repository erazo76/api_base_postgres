import { Injectable } from "@nestjs/common";
import { IPurchaseDetailsRepository } from "application/ports/Repository/PurchaseDetailsRepository/IPurchaseDetailsRepository.interface";
import { IProductsUseCase } from "application/ports/UseCases/ProductsUseCase/IProductsUseCase.interface";
import { IPurchaseDetailsUseCase } from "application/ports/UseCases/PurchaseDetailsUseCase/IPurchaseDetailsUseCase.interface";
import { Page, PageMeta, PageOptions } from "infrastructure/common/page";
import { Products } from "infrastructure/database/mapper/Products.entity";
import { PurchaseDetails } from "infrastructure/database/mapper/PurchaseDetails.entity";

import { DeleteResult, UpdateResult } from "typeorm";

@Injectable()
export class PurchaseDetailsUseCase implements IPurchaseDetailsUseCase {
  constructor(
    private readonly purchaseDetailsRepo: IPurchaseDetailsRepository,
    private readonly productsUseCase: IProductsUseCase
  ) {}

  async getPurchaseDetails(
    pageOpts: PageOptions
  ): Promise<Page<PurchaseDetails>> {
    const [purchases, count] = await this.purchaseDetailsRepo.findAndCount({
      skip: (pageOpts.page - 1) * pageOpts.take,
      take: pageOpts.take,
      relations: ["detail", "seller", "product", "product.category"],
    });
    const pageMeta = new PageMeta(pageOpts, count);
    return new Page(purchases, pageMeta);
  }

  async getPurchaseDetailById(id: string): Promise<PurchaseDetails> {
    try {
      return await this.purchaseDetailsRepo.findOne({
        id: id,
        relations: ["detail", "seller", "product", "product.category"],
      });
    } catch (error) {
      console.log(error);
    }
  }

  getPurchaseDetailByPurchaseId(id: string): Promise<PurchaseDetails[]> {
    return this.purchaseDetailsRepo.find({ where: { detail: id } });
  }

  async createPurchaseDetail(
    moduleModel: PurchaseDetails
  ): Promise<PurchaseDetails> {
    console.log(moduleModel);
    const prod = await this.productsUseCase.getProductById(
      JSON.stringify(moduleModel.product)
    );
    moduleModel.subtotal = this.calculatedSubtotal(
      prod.price,
      moduleModel.quantity
    );
    moduleModel.cost = this.calculatedCost(prod.cost, moduleModel.quantity);
    this.substractionStock(moduleModel.quantity, prod.stock, prod.id);
    return this.purchaseDetailsRepo.save(moduleModel);
  }

  calculatedSubtotal(price: number, qty: number) {
    return Math.round(price * qty * 100) / 100;
  }

  calculatedCost(cost: number, qty: number) {
    return Math.round(cost * qty * 100) / 100;
  }

  async substractionStock(qty: number, stock: number, productId: string) {
    let model = new Products();
    model.id = productId;
    model.stock = stock - qty;
    await this.productsUseCase.updateProduct(model);
  }

  updatePurchaseDetail(moduleModel: PurchaseDetails): Promise<UpdateResult> {
    return this.purchaseDetailsRepo.update(moduleModel.id, moduleModel);
  }

  deletePurchaseDetail(id: string): Promise<DeleteResult> {
    return this.purchaseDetailsRepo.delete(id);
  }
}
