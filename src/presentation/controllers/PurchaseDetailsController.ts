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
import { PurchaseDetails } from "infrastructure/database/mapper/PurchaseDetails.entity";
import { IPurchaseDetailsUseCase } from "application/ports/UseCases/PurchaseDetailsUseCase/IPurchaseDetailsUseCase.interface";
import { Page, PageOptions } from "infrastructure/common/page";
import { PaginateQueryVM } from "presentation/view-models/shared/paginateQuery.dto";
import { CreatePurchaseDetailVM } from "presentation/view-models/purchaseDetails/createPurchaseDetail.dto";
import { UpdatePurchaseDetailVM } from "presentation/view-models/purchaseDetails/updatePurchaseDetail.dto";
import { PurchaseDetailVM } from "presentation/view-models/purchaseDetails/purchaseDetailVM.dto";

@ApiTags("PurchaseDetails")
@Controller("PurchaseDetails")
export class PurchaseDetailsController {
  constructor(
    private readonly PurchaseDetailsUseCase: IPurchaseDetailsUseCase
  ) {}

  @Get()
  @ApiOperation({
    summary: "Find all PurchaseDetails.",
  })
  @ApiOkResponse({
    description: "PurchaseDetails founded.",
    type: PurchaseDetailVM,
    status: 200,
  })
  async getPurchaseDetails(
    @Query() query: PaginateQueryVM
  ): Promise<Page<PurchaseDetails>> {
    const take = query.take;
    const page = query.pag;
    const result = await this.PurchaseDetailsUseCase.getPurchaseDetails({
      page,
      take,
    } as PageOptions).catch(() => "Error al buscar detalle de compra");
    if (typeof result === "string") return { message: result } as any;
    return result;
  }

  @Get("/:id")
  @ApiOperation({
    summary: "Find PurchaseDetail by id",
  })
  @ApiParam({
    name: "id",
    required: true,
    description: "Id of purchaseDetail",
    example: "875c18d4-ca31-4eca-a071-7ed942034497",
  })
  @ApiResponse({
    description: "Found PurchaseDetail",
    type: PurchaseDetailVM,
    status: 200,
  })
  async getPurchaseDetailById(
    @Param("id") purchaseDetailId: string
  ): Promise<PurchaseDetailVM> {
    const result = await this.PurchaseDetailsUseCase.getPurchaseDetailById(
      purchaseDetailId
    ).catch(() => "Error al buscar compra");
    if (typeof result === "string") return { message: result } as any;
    return PurchaseDetailVM.toViewModel(result);
  }

  @Post()
  @ApiOperation({
    summary: "Create purchaseDetail",
  })
  @ApiUnprocessableEntityResponse({
    description: "Validation error while creating PurchaseDetail",
    type: UnprocessableEntityError,
  })
  @ApiResponse({
    description: "PurchaseDetail created",
    type: PurchaseDetailVM,
    status: 200,
  })
  async created(
    @Body() body: CreatePurchaseDetailVM
  ): Promise<PurchaseDetailVM> {
    let purchaseDetail = CreatePurchaseDetailVM.fromViewModel(body);
    const result = await this.PurchaseDetailsUseCase.createPurchaseDetail(
      purchaseDetail
    ).catch(() => "Error al crear detalle de compra");
    if (typeof result === "string") return { message: result } as any;
    return PurchaseDetailVM.toViewModel(result);
  }

  @Put("/:id")
  @ApiOperation({
    summary: "Update purchaseDetail",
  })
  @ApiUnprocessableEntityResponse({
    description: "Validation error while updating purchaseDetail",
    type: UnprocessableEntityError,
  })
  @ApiParam({
    name: "id",
    description: "Id of purchaseDetail",
    example: "875c18d4-ca31-4eca-a071-7ed942034497",
    type: String,
  })
  @ApiResponse({
    description: "PurchaseDetail updated",
    type: PurchaseDetailVM,
    status: 200,
  })
  async update(
    @Param("id") purchaseDetailId: string,
    @Body() body: UpdatePurchaseDetailVM
  ): Promise<PurchaseDetails> {
    const exists = await this.PurchaseDetailsUseCase.getPurchaseDetailById(
      purchaseDetailId
    ).catch(() => "Detalle de compra no encontrada");
    if (!exists || typeof exists === "string")
      return { message: "Detalle de compra no encontrada" } as any;

    const vm = UpdatePurchaseDetailVM.fromViewModel(exists, body);
    const result = await this.PurchaseDetailsUseCase.updatePurchaseDetail(
      vm
    ).catch(() => "No se pudo actualizar");
    if (typeof result === "string") return { message: result } as any;
    return vm;
  }

  @Delete("/:id")
  @ApiOperation({
    summary: "Delete a purchaseDetail",
  })
  @ApiUnprocessableEntityResponse({
    description: "Validation error while deleting purchaseDetail",
    type: UnprocessableEntityError,
  })
  @ApiParam({
    name: "id",
    description: "Id of purchaseDetail",
    example: "875c18d4-ca31-4eca-a071-7ed942034497",
    type: String,
  })
  @ApiResponse({
    description: "Removed purchaseDetail",
    type: Object,
    status: 200,
  })
  async delete(
    @Param("id") purchaseDetailId: string
  ): Promise<{ id?: string; message?: string }> {
    const exists = await this.PurchaseDetailsUseCase.getPurchaseDetailById(
      purchaseDetailId
    ).catch(() => "Compra no encontrada");
    if (!exists || typeof exists === "string")
      return { message: exists || "Compra no encontrada" } as any;
    const result = await this.PurchaseDetailsUseCase.deletePurchaseDetail(
      exists.id
    ).catch(() => "El rol esta siendo usado por otra tabla");
    if (typeof result === "string") return { message: result };
    return { id: exists.id };
  }
}
