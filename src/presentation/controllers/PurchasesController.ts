import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from "@nestjs/swagger";
import { UnprocessableEntityError } from "presentation/errors/UnprocessableEntityError";
import { Purchases } from "infrastructure/database/mapper/Purchases.entity";
import { IPurchasesUseCase } from "application/ports/UseCases/PurchasesUseCase/IPurchasesUseCase.interface";
import { Page, PageOptions } from "infrastructure/common/page";
import { PaginateQueryVM } from "presentation/view-models/shared/paginateQuery.dto";
import { PurchaseVM } from "presentation/view-models/purchases/purchaseVM.dto";
import { CreatePurchaseVM } from "presentation/view-models/purchases/createPurchase.dto";
import { UpdatePurchaseVM } from "presentation/view-models/purchases/updatePurchase.dto";

@ApiTags("Purchases")
@Controller("Purchases")
export class PurchasesController {
  constructor(private readonly PurchasesUseCase: IPurchasesUseCase) {}

  @Get()
  @ApiOperation({
    summary: "Find all Purchases.",
  })
  @ApiOkResponse({
    description: "Purchases founded.",
    type: PurchaseVM,
    status: 200,
  })
  async getPurchases(
    @Query() query: PaginateQueryVM
  ): Promise<Page<Purchases>> {
    const take = query.take;
    const page = query.pag;
    const result = await this.PurchasesUseCase.getPurchases({
      page,
      take,
    } as PageOptions).catch(() => "Error al buscar lista de compra");
    if (typeof result === "string") return { message: result } as any;
    return result;
  }

  @Get("/:id")
  @ApiOperation({
    summary: "Find Purchase by id",
  })
  @ApiParam({
    name: "id",
    required: true,
    description: "Id of purchase",
    example: "875c18d4-ca31-4eca-a071-7ed942034497",
  })
  @ApiResponse({
    description: "Found Purchase",
    type: PurchaseVM,
    status: 200,
  })
  async getPurchaseById(@Param("id") purchaseId: string): Promise<PurchaseVM> {
    const result = await this.PurchasesUseCase.getPurchaseById(
      purchaseId
    ).catch(() => "Error al buscar compra");
    if (typeof result === "string") return { message: result } as any;
    return PurchaseVM.toViewModel(result);
  }

  @Get("/:id/total")
  @ApiOperation({
    summary: "Find Purchase by id",
  })
  @ApiParam({
    name: "id",
    required: true,
    description: "Id of purchase",
    example: "875c18d4-ca31-4eca-a071-7ed942034497",
  })
  @ApiResponse({
    description: "Found Purchase",
    type: PurchaseVM,
    status: 200,
  })
  async calculateTotal(@Param("id") purchaseId: string): Promise<number> {
    const result = await this.PurchasesUseCase.calculateTotal(purchaseId).catch(
      () => "Error alcalcular el total de la compra"
    );
    if (typeof result === "string") return { message: result } as any;
    return result;
  }

  @Post()
  @ApiOperation({
    summary: "Create purchase",
  })
  @ApiUnprocessableEntityResponse({
    description: "Validation error while creating Purchase",
    type: UnprocessableEntityError,
  })
  @ApiResponse({
    description: "Purchase created",
    type: PurchaseVM,
    status: 200,
  })
  async created(@Body() body: CreatePurchaseVM): Promise<PurchaseVM> {
    let purchase = CreatePurchaseVM.fromViewModel(body);
    if (!body.active) {
      purchase.active = true;
    }
    const result = await this.PurchasesUseCase.createPurchase(purchase).catch(
      () => "Error al crear compra"
    );
    if (typeof result === "string") return { message: result } as any;
    return PurchaseVM.toViewModel(result);
  }

  @Put("/:id")
  @ApiOperation({
    summary: "Update purchase",
  })
  @ApiUnprocessableEntityResponse({
    description: "Validation error while updating purchase",
    type: UnprocessableEntityError,
  })
  @ApiParam({
    name: "id",
    description: "Id of purchase",
    example: "875c18d4-ca31-4eca-a071-7ed942034497",
    type: String,
  })
  @ApiResponse({
    description: "Purchase updated",
    type: PurchaseVM,
    status: 200,
  })
  async update(
    @Param("id") purchaseId: string,
    @Body() body: UpdatePurchaseVM
  ): Promise<Purchases> {
    const exists = await this.PurchasesUseCase.getPurchaseById(
      purchaseId
    ).catch(() => "Compra no encontrada");
    if (!exists || typeof exists === "string")
      return { message: "Compra no encontrada" } as any;

    const vm = UpdatePurchaseVM.fromViewModel(exists, body);
    const result = await this.PurchasesUseCase.updatePurchase(vm).catch(
      () => "No se pudo actualizar"
    );
    if (typeof result === "string") return { message: result } as any;
    return vm;
  }

  @Delete("/:id")
  @ApiOperation({
    summary: "Delete a purchase",
  })
  @ApiUnprocessableEntityResponse({
    description: "Validation error while deleting purchase",
    type: UnprocessableEntityError,
  })
  @ApiParam({
    name: "id",
    description: "Id of purchase",
    example: "875c18d4-ca31-4eca-a071-7ed942034497",
    type: String,
  })
  @ApiResponse({
    description: "Removed purchase",
    type: Object,
    status: 200,
  })
  async delete(
    @Param("id") purchaseId: string
  ): Promise<{ id?: string; message?: string }> {
    const exists = await this.PurchasesUseCase.getPurchaseById(
      purchaseId
    ).catch(() => "Compra no encontrada");
    if (!exists || typeof exists === "string")
      return { message: exists || "Compra no encontrada" } as any;
    const result = await this.PurchasesUseCase.deletePurchase(exists.id).catch(
      () => "El rol esta siendo usado por otra tabla"
    );
    if (typeof result === "string") return { message: result };
    return { id: exists.id };
  }
}
