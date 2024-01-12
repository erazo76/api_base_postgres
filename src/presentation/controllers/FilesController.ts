import {
  BadRequestException,
  Body,
  Controller,
  Post,
  HttpStatus,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from "@nestjs/swagger";
import { IFilesUseCase } from "application/ports/UseCases/FilesUseCase/IFilesUseCase.interface";
import { IFile } from "domain/services/cloudinary/IFile.interface";
import { Roles } from "infrastructure/decorators/roles.decorator";
import { RoleEnum } from "infrastructure/enums/role.enum";
import { JwtAuthGuard } from "infrastructure/guards/jwt.guard";
import { RolesGuard } from "infrastructure/guards/roles.guard";
import { memoryStorage } from "multer";
import { UnprocessableEntityError } from "presentation/errors/UnprocessableEntityError";
import { UploadFileVM } from "presentation/view-models/files/createFile.dto";
import { FileVM } from "presentation/view-models/files/fileVM.dto";
import { Response } from "express";

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags("Files")
@Controller("files")
export class FilesController {
  constructor(private readonly fileService: IFilesUseCase) {}

  @Roles(RoleEnum.ADMIN, RoleEnum.CLIENT)
  @ApiOperation({
    summary: "Upload file (jpg, jpeg, png, gif or svg )",
  })
  @ApiUnprocessableEntityResponse({
    description: "Validation error while upload file",
    type: UnprocessableEntityError,
  })
  @ApiResponse({
    description: "File uploaded",
    type: FileVM,
    status: 200,
  })
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
  async uploadFile(
    @Body() body: UploadFileVM,
    @UploadedFile() file: IFile,
    @Res() res: Response
  ): Promise<FileVM | Response> {
    const result = await this.fileService
      .uploadFile(file, body?.bucket)
      .catch(() => "Error al cargar el archivo");
    if (typeof result === "string") {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ statusCode: 404, message: result, data: [], meta: null });
    }
    return res.status(HttpStatus.OK).json({
      statusCode: 200,
      message: "Imagen cargada con exito",
      data: result,
      meta: null,
    });
  }
}
