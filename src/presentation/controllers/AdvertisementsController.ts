import {
  BadRequestException,
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
  UploadedFile,
  UseGuards,
  UseInterceptors,
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
import { Advertisements } from "infrastructure/database/mapper/Advertisements.entity";
import { IAdvertisementsUseCase } from "application/ports/UseCases/AdvertisementsUseCase/IAdvertisementsUseCase.interface";
import { Page, PageOptions } from "infrastructure/common/page";
import { AdvertisementVM } from "presentation/view-models/advertisements/advertisementVM.dto";
import { CreateAdvertisementVM } from "presentation/view-models/advertisements/createAdvertisement.dto";
import { UpdateAdvertisementVM } from "presentation/view-models/advertisements/updateAdvertisement.dto";
import { JwtAuthGuard } from "infrastructure/guards/jwt.guard";
import { RolesGuard } from "infrastructure/guards/roles.guard";
import { RoleEnum } from "infrastructure/enums/role.enum";
import { Roles } from "infrastructure/decorators/roles.decorator";
import { Public } from "infrastructure/decorators/public.decorator";
import { Response } from "express";
import { GetAdvertisementVM } from "presentation/view-models/advertisements/getAdvertisement.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import { IFile } from "domain/services/cloudinary/IFile.interface";

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags("Advertisements")
@Controller("Advertisements")
export class AdvertisementsController {
  constructor(private readonly AdvertisementsUseCase: IAdvertisementsUseCase) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: "Find all Advertisements.",
  })
  @ApiOkResponse({
    description: "Advertisements founded.",
    type: AdvertisementVM,
    status: 200,
  })
  async getAdvertisements(
    @Query() query: GetAdvertisementVM,
    @Res() res: Response
  ): Promise<Page<Advertisements> | Response> {
    const take = query.take;
    const page = query.pag;
    const result = await this.AdvertisementsUseCase.getAdvertisements({
      page,
      take,
    } as PageOptions).catch(() => "Error al buscar lista de advertisementos");
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
    summary: "Find Advertisement by id",
  })
  @ApiParam({
    name: "id",
    required: true,
    description: "Id of advertisement",
    example: "875c18d4-ca31-4eca-a071-7ed942034497",
  })
  @ApiResponse({
    description: "Found Advertisement",
    type: AdvertisementVM,
    status: 200,
  })
  async getAdvertisementById(
    @Param("id") advertisementId: string,
    @Res() res: Response
  ): Promise<AdvertisementVM | Response> {
    const result = await this.AdvertisementsUseCase.getAdvertisementById(
      advertisementId
    );
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
      data: AdvertisementVM.toViewModel(result),
      meta: null,
    });
  }

  @Roles(RoleEnum.ADMIN)
  @UseInterceptors(
    FileInterceptor("file", {
      storage: memoryStorage(),
      limits: { fileSize: 2097152 }, // 2MB --- 2*2^20
      fileFilter: (req, file, callback) => {
        return RegExp(/image\/(jpg|jpeg|png|gif|svg\+xml)$/).exec(file.mimetype)
          ? callback(null, true)
          : callback(
              new BadRequestException("Only image files are allowed"),
              false
            );
      },
    })
  )
  @Post()
  @ApiOperation({
    summary: "Create advertisement",
  })
  @ApiUnprocessableEntityResponse({
    description: "Validation error while creating Advertisement",
    type: UnprocessableEntityError,
  })
  @ApiResponse({
    description: "Anuncio created",
    type: AdvertisementVM,
    status: 200,
  })
  async created(
    @Body() body: CreateAdvertisementVM,
    @UploadedFile() file: IFile,
    @Res() res: Response
  ): Promise<AdvertisementVM | Response> {
    let advertisement = CreateAdvertisementVM.fromViewModel(body);
    let existsAdvertisement = await this.AdvertisementsUseCase.getAdvertisementByTitle(
      body.title
    ).catch(() => "error");
    if (existsAdvertisement) {
      return res.status(HttpStatus.CONFLICT).json({
        statusCode: 409,
        message: "Anuncio existente",
        data: [],
        meta: null,
      });
    }

    const result = await this.AdvertisementsUseCase.createAdvertisement(
      file,
      advertisement
    ).catch(() => "Error al crear el anuncio");
    if (typeof result === "string")
      return res
        .status(HttpStatus.CONFLICT)
        .json({ statusCode: 409, message: result, data: [], meta: null });
    return res.status(HttpStatus.CREATED).json({
      statusCode: 201,
      message: "Registro exitoso",
      data: AdvertisementVM.toViewModel(result),
      meta: null,
    });
  }

  @Roles(RoleEnum.ADMIN)
  @UseInterceptors(
    FileInterceptor("file", {
      storage: memoryStorage(),
      limits: { fileSize: 2097152 }, // 2MB --- 2*2^20
      fileFilter: (req, file, callback) => {
        return RegExp(/image\/(jpg|jpeg|png|gif|svg\+xml)$/).exec(file.mimetype)
          ? callback(null, true)
          : callback(
              new BadRequestException("Only image files are allowed"),
              false
            );
      },
    })
  )
  @Put("/:id")
  @ApiOperation({
    summary: "Update advertisement",
  })
  @ApiUnprocessableEntityResponse({
    description: "Validation error while updating advertisement",
    type: UnprocessableEntityError,
  })
  @ApiParam({
    name: "id",
    description: "Id of advertisement",
    example: "875c18d4-ca31-4eca-a071-7ed942034497",
    type: String,
  })
  @ApiResponse({
    description: "Advertisement updated",
    type: AdvertisementVM,
    status: 200,
  })
  async update(
    @Param("id") advertisementId: string,
    @Body() body: UpdateAdvertisementVM,
    @UploadedFile() file: IFile,
    @Res() res: Response
  ): Promise<Advertisements | Response> {
    const exists = await this.AdvertisementsUseCase.getAdvertisementById(
      advertisementId
    );
    if (!exists)
      return res.status(HttpStatus.NOT_FOUND).json({
        statusCode: 404,
        message: "Anuncio no encontrado",
        data: [],
        meta: null,
      });

    const existsAdvertisement = await this.AdvertisementsUseCase.getAdvertisementByTitle(
      body.title
    ).catch(() => "error");

    const idAdvertisement =
      typeof existsAdvertisement == "object"
        ? exists.id == existsAdvertisement.id
        : false;
    if (existsAdvertisement && !idAdvertisement) {
      return res.status(HttpStatus.CONFLICT).json({
        statusCode: 409,
        message: "Anuncio existente",
        data: [],
        meta: null,
      });
    }
    const vm = UpdateAdvertisementVM.fromViewModel(exists, body);
    const result = await this.AdvertisementsUseCase.updateAdvertisement(
      file,
      vm
    );
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
    summary: "Delete a advertisement",
  })
  @ApiUnprocessableEntityResponse({
    description: "Validation error while deleting advertisement",
    type: UnprocessableEntityError,
  })
  @ApiParam({
    name: "id",
    description: "Id of advertisement",
    example: "875c18d4-ca31-4eca-a071-7ed942034497",
    type: String,
  })
  @ApiResponse({
    description: "Removed advertisement",
    type: Object,
    status: 200,
  })
  async delete(
    @Param("id") advertisementId: string
  ): Promise<{ id?: string; message?: string }> {
    const exists = await this.AdvertisementsUseCase.getAdvertisementById(
      advertisementId
    ).catch(() => "Advertisemento no encontrado");
    if (!exists || typeof exists === "string")
      return { message: exists || "Advertisemento no encontrado" } as any;
    const result = await this.AdvertisementsUseCase.deleteAdvertisement(
      exists.id
    ).catch(() => "El rol esta siendo usado por otra tabla");
    if (typeof result === "string") return { message: result };
    return { id: exists.id };
  }
}
