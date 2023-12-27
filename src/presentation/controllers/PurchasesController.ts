import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
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
import { PurchaseVM } from "presentation/view-models/purchases/purchaseVM.dto";
import { CreatePurchaseVM } from "presentation/view-models/purchases/createPurchase.dto";
import { UpdatePurchaseVM } from "presentation/view-models/purchases/updatePurchase.dto";
import { JwtAuthGuard } from "infrastructure/guards/jwt.guard";
import { RolesGuard } from "infrastructure/guards/roles.guard";
import { Public } from "infrastructure/decorators/public.decorator";
import { Roles } from "infrastructure/decorators/roles.decorator";
import { RoleEnum } from "infrastructure/enums/role.enum";
import { GetPurchaseVM } from "presentation/view-models/purchases/getPurchase.dto";
import { Request, Response } from "express";

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags("Purchases")
@Controller("Purchases")
export class PurchasesController {
  constructor(private readonly PurchasesUseCase: IPurchasesUseCase) {}

  @Roles(RoleEnum.ADMIN, RoleEnum.CLIENT, RoleEnum.SELLER)
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
    @Query() query: GetPurchaseVM,
    @Res() res: Response,
    @Req() req: Request
  ): Promise<Page<Purchases> | Response> {
    const search = query.search;
    const roling = [req.user["role"], req.user["id"]];
    const take = query.take;
    const page = query.pag;
    const status = query.status;
    const startDate = query.startDate;
    const endDate = query.endDate;
    const result = await this.PurchasesUseCase.getPurchases(
      {
        page,
        take,
      } as PageOptions,
      search,
      roling,
      status,
      startDate,
      endDate
    ).catch(() => "Error al buscar lista de compra");
    if (typeof result === "string") {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ statusCode: 404, message: result, data: [], meta: null });
    }
    return res.status(HttpStatus.OK).json({
      statusCode: 200,
      message: "Consulta exitosa",
      data: result["data"],
      meta: result["meta"],
    });
  }

  @Public()
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
  async getPurchaseById(
    @Param("id") purchaseId: string,
    @Res() res: Response
  ): Promise<PurchaseVM | Response> {
    const result = await this.PurchasesUseCase.getPurchaseById(purchaseId);
    if (!result) {
      return res.status(HttpStatus.NOT_FOUND).json({
        statusCode: 404,
        message: "Compra no encontrada",
        data: [],
        meta: null,
      });
    }
    return res.status(HttpStatus.OK).json({
      statusCode: 200,
      message: "Consulta exitosa",
      data: PurchaseVM.toViewModel(result),
      meta: null,
    });
  }

  @Public()
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
      () => "Error al calcular el total de la compra"
    );
    if (typeof result === "string") return { message: result } as any;
    return result;
  }

  @Public()
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
  async created(
    @Body() body: CreatePurchaseVM,
    @Res() res: Response
  ): Promise<PurchaseVM | Response> {
    let purchase = CreatePurchaseVM.fromViewModel(body);
    if (!body.active) {
      purchase.active = true;
    }
    const result = await this.PurchasesUseCase.createPurchase(purchase).catch(
      () => "Error al crear compra"
    );
    if (typeof result === "string")
      return res
        .status(HttpStatus.CONFLICT)
        .json({ statusCode: 409, message: result, data: [], meta: null });

    return res.status(HttpStatus.CREATED).json({
      statusCode: 201,
      message: "Registro exitoso",
      data: PurchaseVM.toViewModel(result),
      meta: null,
    });
  }

  @Public()
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
    @Body() body: UpdatePurchaseVM,
    @Res() res: Response
  ): Promise<Purchases | Response> {
    const exists = await this.PurchasesUseCase.getPurchaseByIdBase(purchaseId);

    if (!exists)
      return res.status(HttpStatus.NOT_FOUND).json({
        statusCode: 404,
        message: "Compra no encontrada",
        data: [],
        meta: null,
      });

    const vm = UpdatePurchaseVM.fromViewModel(exists, body);
    const result = await this.PurchasesUseCase.updatePurchase(vm);
    if (!result)
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: 500,
        message: "No se realizó la actualización",
        data: [],
        meta: null,
      });
    return res.status(HttpStatus.OK).json({
      statusCode: 200,
      message: "Actualización exitosa",
      data: vm,
      meta: null,
    });
  }

  @Public()
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
