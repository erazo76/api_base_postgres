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
import { Products } from "infrastructure/database/mapper/Products.entity";
import { IProductsUseCase } from "application/ports/UseCases/ProductsUseCase/IProductsUseCase.interface";
import { Page, PageOptions } from "infrastructure/common/page";
import { ProductVM } from "presentation/view-models/products/productVM.dto";
import { CreateProductVM } from "presentation/view-models/products/createProduct.dto";
import { UpdateProductVM } from "presentation/view-models/products/updateProduct.dto";
import { ReplenishStockVM } from "presentation/view-models/products/replenishStock.dto";
import { JwtAuthGuard } from "infrastructure/guards/jwt.guard";
import { RolesGuard } from "infrastructure/guards/roles.guard";
import { RoleEnum } from "infrastructure/enums/role.enum";
import { Roles } from "infrastructure/decorators/roles.decorator";
import { Public } from "infrastructure/decorators/public.decorator";
import { Response } from "express";
import { GetProductVM } from "presentation/view-models/products/getProduct.dto";

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags("Products")
@Controller("Products")
export class ProductsController {
  constructor(private readonly ProductsUseCase: IProductsUseCase) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: "Find all Products.",
  })
  @ApiOkResponse({
    description: "Products founded.",
    type: ProductVM,
    status: 200,
  })
  async getProducts(
    @Query() query: GetProductVM,
    @Res() res: Response
  ): Promise<Page<Products> | Response> {
    const take = query.take;
    const page = query.pag;
    const category = query.category;
    const result = await this.ProductsUseCase.getProducts(
      {
        page,
        take,
      } as PageOptions,
      category
    ).catch(() => "Error al buscar lista de productos");
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
    summary: "Find Product by id",
  })
  @ApiParam({
    name: "id",
    required: true,
    description: "Id of product",
    example: "875c18d4-ca31-4eca-a071-7ed942034497",
  })
  @ApiResponse({
    description: "Found Product",
    type: ProductVM,
    status: 200,
  })
  async getProductById(
    @Param("id") productId: string,
    @Res() res: Response
  ): Promise<ProductVM | Response> {
    const result = await this.ProductsUseCase.getProductById(productId);
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
      data: ProductVM.toViewModel(result),
      meta: null,
    });
  }

  @Roles(RoleEnum.ADMIN)
  @Post("/:id/replenish")
  @ApiOperation({
    summary: "Find Product by id",
  })
  @ApiParam({
    name: "id",
    required: true,
    description: "Id of product",
    example: "875c18d4-ca31-4eca-a071-7ed942034497",
  })
  @ApiResponse({
    description: "Found Product",
    type: ProductVM,
    status: 200,
  })
  async replenishStock(
    @Param("id") productId: string,
    @Body() body: ReplenishStockVM,
    @Res() res: Response
  ): Promise<any> {
    const result = await this.ProductsUseCase.replenishStock(
      productId,
      body.stock,
      body.cost
    );
    if (result.affected == 0)
      return res.status(HttpStatus.CONFLICT).json({
        statusCode: 409,
        message: "Error al reponer existencias",
        data: [],
        meta: null,
      });

    return res.status(HttpStatus.OK).json({
      statusCode: 200,
      message: "Reposición de existencias exitosa",
      data: [],
      meta: null,
    });
  }

  @Roles(RoleEnum.ADMIN)
  @Post()
  @ApiOperation({
    summary: "Create product",
  })
  @ApiUnprocessableEntityResponse({
    description: "Validation error while creating Product",
    type: UnprocessableEntityError,
  })
  @ApiResponse({
    description: "Product created",
    type: ProductVM,
    status: 200,
  })
  async created(
    @Body() body: CreateProductVM,
    @Res() res: Response
  ): Promise<ProductVM | Response> {
    let product = CreateProductVM.fromViewModel(body);
    let existsProduct = await this.ProductsUseCase.getProductByName(
      body.name
    ).catch(() => "error");
    if (existsProduct) {
      return res.status(HttpStatus.CONFLICT).json({
        statusCode: 409,
        message: "Producto existente",
        data: [],
        meta: null,
      });
    }
    if (!body.active) {
      product.active = true;
    }
    const result = await this.ProductsUseCase.createProduct(product).catch(
      () => "Error al crear el producto"
    );
    if (typeof result === "string")
      return res
        .status(HttpStatus.CONFLICT)
        .json({ statusCode: 409, message: result, data: [], meta: null });
    return res.status(HttpStatus.CREATED).json({
      statusCode: 201,
      message: "Registro exitoso",
      data: ProductVM.toViewModel(result),
      meta: null,
    });
  }

  @Roles(RoleEnum.ADMIN)
  @Put("/:id")
  @ApiOperation({
    summary: "Update product",
  })
  @ApiUnprocessableEntityResponse({
    description: "Validation error while updating product",
    type: UnprocessableEntityError,
  })
  @ApiParam({
    name: "id",
    description: "Id of product",
    example: "875c18d4-ca31-4eca-a071-7ed942034497",
    type: String,
  })
  @ApiResponse({
    description: "Product updated",
    type: ProductVM,
    status: 200,
  })
  async update(
    @Param("id") productId: string,
    @Body() body: UpdateProductVM,
    @Res() res: Response
  ): Promise<Products | Response> {
    const exists = await this.ProductsUseCase.getProductById(productId);
    if (!exists)
      return res.status(HttpStatus.NOT_FOUND).json({
        statusCode: 404,
        message: "Producto no encontrado",
        data: [],
        meta: null,
      });

    const existsProduct = await this.ProductsUseCase.getProductByName(
      body.name
    ).catch(() => "error");

    const idProduct =
      typeof existsProduct == "object" ? exists.id == existsProduct.id : false;
    if (existsProduct && !idProduct) {
      return res.status(HttpStatus.CONFLICT).json({
        statusCode: 409,
        message: "Producto existente",
        data: [],
        meta: null,
      });
    }
    const vm = UpdateProductVM.fromViewModel(exists, body);
    const result = await this.ProductsUseCase.updateProduct(vm);
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

  @Roles(RoleEnum.ADMIN)
  @Delete("/:id")
  @ApiOperation({
    summary: "Delete a product",
  })
  @ApiUnprocessableEntityResponse({
    description: "Validation error while deleting product",
    type: UnprocessableEntityError,
  })
  @ApiParam({
    name: "id",
    description: "Id of product",
    example: "875c18d4-ca31-4eca-a071-7ed942034497",
    type: String,
  })
  @ApiResponse({
    description: "Removed product",
    type: Object,
    status: 200,
  })
  async delete(
    @Param("id") productId: string
  ): Promise<{ id?: string; message?: string }> {
    const exists = await this.ProductsUseCase.getProductById(productId).catch(
      () => "Producto no encontrado"
    );
    if (!exists || typeof exists === "string")
      return { message: exists || "Producto no encontrado" } as any;
    const result = await this.ProductsUseCase.deleteProduct(exists.id).catch(
      () => "El rol esta siendo usado por otra tabla"
    );
    if (typeof result === "string") return { message: result };
    return { id: exists.id };
  }
}
