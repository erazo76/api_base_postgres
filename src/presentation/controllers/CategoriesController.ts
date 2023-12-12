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
import { Response } from "express";
import { Public } from "infrastructure/decorators/public.decorator";

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags("Categories")
@Controller("Categories")
export class CategoriesController {
  constructor(private readonly CategoriesUseCase: ICategoriesUseCase) {}

  @Public()
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
    @Query() query: PaginateQueryVM,
    @Res() res: Response
  ): Promise<Page<Categories> | Response> {
    const take = query.take;
    const page = query.pag;
    const result = await this.CategoriesUseCase.getCategories({
      page,
      take,
    } as PageOptions).catch(() => "Error al buscar lista de categorias");
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
    @Param("id") categoryId: string,
    @Res() res: Response
  ): Promise<CategorieVM | Response> {
    const result = await this.CategoriesUseCase.getCategorieById(categoryId);
    if (!result) {
      return res.status(HttpStatus.NOT_FOUND).json({
        statusCode: 404,
        message: "Categoría no encontrada",
        data: [],
        meta: null,
      });
    }
    return res.status(HttpStatus.OK).json({
      statusCode: 200,
      message: "Consulta exitosa",
      data: CategorieVM.toViewModel(result),
      meta: null,
    });
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
  async created(
    @Body() body: CreateCategorieVM,
    @Res() res: Response
  ): Promise<CategorieVM | Response> {
    let category = CreateCategorieVM.fromViewModel(body);
    let existsCategorie = await this.CategoriesUseCase.getCategorieByName(
      body.name
    ).catch(() => "error");
    if (existsCategorie) {
      return res.status(HttpStatus.CONFLICT).json({
        statusCode: 409,
        message: "Categoría existente",
        data: [],
        meta: null,
      });
    }
    if (!body.active) {
      category.active = true;
    }
    const result = await this.CategoriesUseCase.createCategorie(category).catch(
      () => "Error al crear la categoría"
    );
    if (typeof result === "string")
      return res
        .status(HttpStatus.CONFLICT)
        .json({ statusCode: 409, message: result, data: [], meta: null });
    return res.status(HttpStatus.CREATED).json({
      statusCode: 201,
      message: "Registro exitoso",
      data: CategorieVM.toViewModel(result),
      meta: null,
    });
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
    @Body() body: UpdateCategorieVM,
    @Res() res: Response
  ): Promise<Categories | Response> {
    const exists = await this.CategoriesUseCase.getCategorieById(categoryId);
    if (!exists)
      return res.status(HttpStatus.NOT_FOUND).json({
        statusCode: 404,
        message: "Categoría no encontrada",
        data: [],
        meta: null,
      });

    const existsCategorie = await this.CategoriesUseCase.getCategorieByName(
      body.name
    ).catch(() => "error");

    const idCategory =
      typeof existsCategorie == "object"
        ? exists.id == existsCategorie.id
        : false;
    if (existsCategorie && !idCategory) {
      return res.status(HttpStatus.CONFLICT).json({
        statusCode: 409,
        message: "Categoría existente",
        data: [],
        meta: null,
      });
    }
    const vm = UpdateCategorieVM.fromViewModel(exists, body);
    const result = await this.CategoriesUseCase.updateCategorie(vm);
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
