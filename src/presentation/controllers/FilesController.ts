import {
  BadRequestException,
  Body,
  Controller,
  Post,
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

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags("Files")
@Controller("files")
export class FilesController {
  constructor(private readonly fileService: IFilesUseCase) {}

  @Roles(RoleEnum.ADMIN)
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
    @UploadedFile() file: IFile
  ): Promise<FileVM> {
    const result = await this.fileService
      .uploadFile(file, body?.bucket)
      .catch(() => "Error al cargar el archivo");
    if (typeof result === "string") return { message: result } as any;
    return result;
  }
}
