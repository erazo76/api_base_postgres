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
import { Products } from "infrastructure/database/mapper/Products.entity";
import { IProductsUseCase } from "application/ports/UseCases/ProductsUseCase/IProductsUseCase.interface";
import { Page, PageOptions } from "infrastructure/common/page";
import { PaginateQueryVM } from "presentation/view-models/shared/paginateQuery.dto";
import { ProductVM } from "presentation/view-models/products/productVM.dto";
import { CreateProductVM } from "presentation/view-models/products/createProduct.dto";
import { UpdateProductVM } from "presentation/view-models/products/updateProduct.dto";
import { ReplenishStockVM } from "presentation/view-models/products/replenishStock.dto";

@ApiTags("Products")
@Controller("Products")
export class ProductsController {
  constructor(private readonly ProductsUseCase: IProductsUseCase) {}

  @Get()
  @ApiOperation({
    summary: "Find all Products.",
  })
  @ApiOkResponse({
    description: "Products founded.",
    type: ProductVM,
    status: 200,
  })
  async getProducts(@Query() query: PaginateQueryVM): Promise<Page<Products>> {
    const take = query.take;
    const page = query.pag;
    const result = await this.ProductsUseCase.getProducts({
      page,
      take,
    } as PageOptions).catch(() => "Error al buscar lista de productos");
    if (typeof result === "string") return { message: result } as any;
    return result;
  }

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
  async getProductById(@Param("id") productId: string): Promise<ProductVM> {
    const result = await this.ProductsUseCase.getProductById(productId).catch(
      () => "Error al buscar el producto"
    );
    if (typeof result === "string") return { message: result } as any;
    return ProductVM.toViewModel(result);
  }

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
    @Body() body: ReplenishStockVM
  ): Promise<any> {
    const result = await this.ProductsUseCase.replenishStock(
      productId,
      body.stock,
      body.cost
    ).catch(() => "Error al reponer existencias");
    if (typeof result === "string") return { message: result } as any;
    return result;
  }

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
  async created(@Body() body: CreateProductVM): Promise<ProductVM> {
    let product = CreateProductVM.fromViewModel(body);
    let existsProduct = await this.ProductsUseCase.getProductByName(
      body.name
    ).catch(() => "error");
    if (existsProduct) {
      return {
        message: "Producto existente",
      } as any;
    }
    if (!body.active) {
      product.active = true;
    }
    const result = await this.ProductsUseCase.createProduct(product).catch(
      () => "Error al crear el producto"
    );
    if (typeof result === "string") return { message: result } as any;
    return ProductVM.toViewModel(result);
  }

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
    @Body() body: UpdateProductVM
  ): Promise<Products> {
    const exists = await this.ProductsUseCase.getProductById(productId).catch(
      () => "Producto no encontrado"
    );
    if (!exists || typeof exists === "string")
      return { message: "Producto no encontrado" } as any;

    const existsProduct = await this.ProductsUseCase.getProductByName(
      body.name
    ).catch(() => "error");

    const idProduct =
      typeof existsProduct == "object" ? exists.id == existsProduct.id : false;
    if (existsProduct && !idProduct) {
      return {
        message: "Producto existente",
      } as any;
    }
    const vm = UpdateProductVM.fromViewModel(exists, body);
    const result = await this.ProductsUseCase.updateProduct(vm).catch(
      () => "No se pudo actualizar"
    );
    if (typeof result === "string") return { message: result } as any;
    return vm;
  }

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
