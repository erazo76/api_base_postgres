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
import { Banks } from "infrastructure/database/mapper/Banks.entity";
import { IBanksUseCase } from "application/ports/UseCases/BanksUseCase/IBanksUseCase.interface";
import { Page, PageOptions } from "infrastructure/common/page";
import { BankVM } from "presentation/view-models/banks/bankVM.dto";
import { CreateBankVM } from "presentation/view-models/banks/createBank.dto";
import { UpdateBankVM } from "presentation/view-models/banks/updateBank.dto";
import { JwtAuthGuard } from "infrastructure/guards/jwt.guard";
import { RolesGuard } from "infrastructure/guards/roles.guard";
import { RoleEnum } from "infrastructure/enums/role.enum";
import { Roles } from "infrastructure/decorators/roles.decorator";
import { Public } from "infrastructure/decorators/public.decorator";
import { Response } from "express";
import { GetBankVM } from "presentation/view-models/banks/getBank.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import { IFile } from "domain/services/cloudinary/IFile.interface";

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags("Banks")
@Controller("Banks")
export class BanksController {
  constructor(private readonly BanksUseCase: IBanksUseCase) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: "Find all Banks.",
  })
  @ApiOkResponse({
    description: "Banks founded.",
    type: BankVM,
    status: 200,
  })
  async getBanks(
    @Query() query: GetBankVM,
    @Res() res: Response
  ): Promise<Page<Banks> | Response> {
    const take = query.take;
    const page = query.pag;
    const result = await this.BanksUseCase.getBanks({
      page,
      take,
    } as PageOptions).catch(() => "Error al buscar lista de bankos");
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
    summary: "Find Bank by id",
  })
  @ApiParam({
    name: "id",
    required: true,
    description: "Id of bank",
    example: "875c18d4-ca31-4eca-a071-7ed942034497",
  })
  @ApiResponse({
    description: "Found Bank",
    type: BankVM,
    status: 200,
  })
  async getBankById(
    @Param("id") bankId: string,
    @Res() res: Response
  ): Promise<BankVM | Response> {
    const result = await this.BanksUseCase.getBankById(bankId);
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
      data: BankVM.toViewModel(result),
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
    summary: "Create bank",
  })
  @ApiUnprocessableEntityResponse({
    description: "Validation error while creating Bank",
    type: UnprocessableEntityError,
  })
  @ApiResponse({
    description: "Anuncio created",
    type: BankVM,
    status: 200,
  })
  async created(
    @Body() body: CreateBankVM,
    @UploadedFile() file: IFile,
    @Res() res: Response
  ): Promise<BankVM | Response> {
    let bank = CreateBankVM.fromViewModel(body);
    let existsBank = await this.BanksUseCase.getBankByName(body.name).catch(
      () => "error"
    );
    if (existsBank) {
      return res.status(HttpStatus.CONFLICT).json({
        statusCode: 409,
        message: "Anuncio existente",
        data: [],
        meta: null,
      });
    }

    const result = await this.BanksUseCase.createBank(file, bank).catch(
      () => "Error al crear el anuncio"
    );
    if (typeof result === "string")
      return res
        .status(HttpStatus.CONFLICT)
        .json({ statusCode: 409, message: result, data: [], meta: null });
    return res.status(HttpStatus.CREATED).json({
      statusCode: 201,
      message: "Registro exitoso",
      data: BankVM.toViewModel(result),
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
    summary: "Update bank",
  })
  @ApiUnprocessableEntityResponse({
    description: "Validation error while updating bank",
    type: UnprocessableEntityError,
  })
  @ApiParam({
    name: "id",
    description: "Id of bank",
    example: "875c18d4-ca31-4eca-a071-7ed942034497",
    type: String,
  })
  @ApiResponse({
    description: "Bank updated",
    type: BankVM,
    status: 200,
  })
  async update(
    @Param("id") bankId: string,
    @Body() body: UpdateBankVM,
    @UploadedFile() file: IFile,
    @Res() res: Response
  ): Promise<Banks | Response> {
    const exists = await this.BanksUseCase.getBankById(bankId);
    if (!exists)
      return res.status(HttpStatus.NOT_FOUND).json({
        statusCode: 404,
        message: "Anuncio no encontrado",
        data: [],
        meta: null,
      });

    const existsBank = await this.BanksUseCase.getBankByName(body.name).catch(
      () => "error"
    );

    const idBank =
      typeof existsBank == "object" ? exists.id == existsBank.id : false;
    if (existsBank && !idBank) {
      return res.status(HttpStatus.CONFLICT).json({
        statusCode: 409,
        message: "Anuncio existente",
        data: [],
        meta: null,
      });
    }
    const vm = UpdateBankVM.fromViewModel(exists, body);
    const result = await this.BanksUseCase.updateBank(file, vm);
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
    summary: "Delete a bank",
  })
  @ApiUnprocessableEntityResponse({
    description: "Validation error while deleting bank",
    type: UnprocessableEntityError,
  })
  @ApiParam({
    name: "id",
    description: "Id of bank",
    example: "875c18d4-ca31-4eca-a071-7ed942034497",
    type: String,
  })
  @ApiResponse({
    description: "Removed bank",
    type: Object,
    status: 200,
  })
  async delete(
    @Param("id") bankId: string
  ): Promise<{ id?: string; message?: string }> {
    const exists = await this.BanksUseCase.getBankById(bankId).catch(
      () => "Banko no encontrado"
    );
    if (!exists || typeof exists === "string")
      return { message: exists || "Banko no encontrado" } as any;
    const result = await this.BanksUseCase.deleteBank(exists.id).catch(
      () => "El rol esta siendo usado por otra tabla"
    );
    if (typeof result === "string") return { message: result };
    return { id: exists.id };
  }
}
