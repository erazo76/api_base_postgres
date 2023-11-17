import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
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
import { UpdateCategorieVM } from "presentation/view-models/categories/updateCategory.dto";
import { CategorieVM } from "presentation/view-models/categories/categoryVM.dto";
import { Categories } from "infrastructure/database/mapper/Categories.entity";
import { ICategoriesUseCase } from "application/ports/UseCases/CategoriesUseCase/ICategoriesUseCase.interface";
import { Page, PageOptions } from "infrastructure/common/page";
import { PaginateQueryVM } from "presentation/view-models/shared/paginateQuery.dto";
import { CreateCategorieVM } from "presentation/view-models/categories/createCategory.dto";
import { JwtAuthGuard } from "infrastructure/guards/jwt.guard";
import { RolesGuard } from "infrastructure/guards/roles.guard";
import { Roles } from "infrastructure/decorators/roles.decorator";
import { RoleEnum } from "infrastructure/enums/role.enum";

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags("Categories")
@Controller("Categories")
export class CategoriesController {
  constructor(private readonly CategoriesUseCase: ICategoriesUseCase) {}

  @Roles(RoleEnum.ADMIN, RoleEnum.CLIENT, RoleEnum.SELLER)
  @Get()
  @ApiOperation({
    summary: "Find all Categories.",
  })
  @ApiOkResponse({
    description: "Categories founded.",
    type: CategorieVM,
    status: 200,
  })
  async getCategories(
    @Query() query: PaginateQueryVM
  ): Promise<Page<Categories>> {
    const take = query.take;
    const page = query.pag;
    const result = await this.CategoriesUseCase.getCategories({
      page,
      take,
    } as PageOptions).catch(() => "Error al buscar lista de categorias");
    if (typeof result === "string") return { message: result } as any;
    return result;
  }

  @Roles(RoleEnum.ADMIN, RoleEnum.CLIENT, RoleEnum.SELLER)
  @Get("/:id")
  @ApiOperation({
    summary: "Find Category by id",
  })
  @ApiParam({
    name: "id",
    required: true,
    description: "Id of category",
    example: "875c18d4-ca31-4eca-a071-7ed942034497",
  })
  @ApiResponse({
    description: "Found Category",
    type: CategorieVM,
    status: 200,
  })
  async getCategorieById(
    @Param("id") categoryId: string
  ): Promise<CategorieVM> {
    const result = await this.CategoriesUseCase.getCategorieById(
      categoryId
    ).catch(() => "Error al buscar la categoria");
    if (typeof result === "string") return { message: result } as any;
    return CategorieVM.toViewModel(result);
  }

  @Roles(RoleEnum.ADMIN)
  @Post()
  @ApiOperation({
    summary: "Create category",
  })
  @ApiUnprocessableEntityResponse({
    description: "Validation error while creating Category",
    type: UnprocessableEntityError,
  })
  @ApiResponse({
    description: "Category created",
    type: CategorieVM,
    status: 200,
  })
  async created(@Body() body: CreateCategorieVM): Promise<CategorieVM> {
    let category = CreateCategorieVM.fromViewModel(body);
    let existsCategorie = await this.CategoriesUseCase.getCategorieByName(
      body.name
    ).catch(() => "error");
    if (existsCategorie) {
      return {
        message: "Categoria existente",
      } as any;
    }
    if (!body.active) {
      category.active = true;
    }
    const result = await this.CategoriesUseCase.createCategorie(category).catch(
      () => "Error al crear la categoria"
    );
    if (typeof result === "string") return { message: result } as any;
    return result;
  }

  @Roles(RoleEnum.ADMIN)
  @Put("/:id")
  @ApiOperation({
    summary: "Update category",
  })
  @ApiUnprocessableEntityResponse({
    description: "Validation error while updating category",
    type: UnprocessableEntityError,
  })
  @ApiParam({
    name: "id",
    description: "Id of category",
    example: "875c18d4-ca31-4eca-a071-7ed942034497",
    type: String,
  })
  @ApiResponse({
    description: "Category updated",
    type: CategorieVM,
    status: 200,
  })
  async update(
    @Param("id") categoryId: string,
    @Body() body: UpdateCategorieVM
  ): Promise<Categories> {
    const exists = await this.CategoriesUseCase.getCategorieById(
      categoryId
    ).catch(() => "Categoria no encontrada");
    if (!exists || typeof exists === "string")
      return { message: "Categoria no encontrada" } as any;

    const existsCategorie = await this.CategoriesUseCase.getCategorieByName(
      body.name
    ).catch(() => "error");

    const idCategory =
      typeof existsCategorie == "object"
        ? exists.id == existsCategorie.id
        : false;
    if (existsCategorie && !idCategory) {
      return {
        message: "Categoria existente",
      } as any;
    }
    const vm = UpdateCategorieVM.fromViewModel(exists, body);
    const result = await this.CategoriesUseCase.updateCategorie(vm).catch(
      () => "No se pudo actualizar"
    );
    if (typeof result === "string") return { message: result } as any;
    return vm;
  }

  @Roles(RoleEnum.ADMIN)
  @Delete("/:id")
  @ApiOperation({
    summary: "Delete a category",
  })
  @ApiUnprocessableEntityResponse({
    description: "Validation error while deleting category",
    type: UnprocessableEntityError,
  })
  @ApiParam({
    name: "id",
    description: "Id of category",
    example: "875c18d4-ca31-4eca-a071-7ed942034497",
    type: String,
  })
  @ApiResponse({
    description: "Removed category",
    type: Object,
    status: 200,
  })
  async delete(
    @Param("id") categoryId: string
  ): Promise<{ id?: string; message?: string }> {
    const exists = await this.CategoriesUseCase.getCategorieById(
      categoryId
    ).catch(() => "Categoria no encontrada");
    if (!exists || typeof exists === "string")
      return { message: exists || "Categoria no encontrada" } as any;
    const result = await this.CategoriesUseCase.deleteCategorie(
      exists.id
    ).catch(() => "El rol esta siendo usado por otra tabla");
    if (typeof result === "string") return { message: result };
    return { id: exists.id };
  }
}
