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
import * as crypto from "crypto";
import { UnprocessableEntityError } from "presentation/errors/UnprocessableEntityError";
import { PaginateQueryVM } from "presentation/view-models/shared/paginateQuery.dto";
import { PagVM } from "presentation/view-models/shared/PagVM.dto";
import { CreateUserVM } from "presentation/view-models/users/createUser.dto";
import { UpdateUserVM } from "presentation/view-models/users/updateUser.dto";
import { UserVM } from "presentation/view-models/users/userVM.dto";
import { constants } from "domain/shared/constants";
import { v4 as uuidv4 } from "uuid";
import { Users } from "infrastructure/database/mapper/Users.entity";
import { IUsersUseCase } from "application/ports/UseCases/UsersUseCase/IUsersUseCase.interface";
import { JwtAuthGuard } from "infrastructure/guards/jwt.guard";
import { RolesGuard } from "infrastructure/guards/roles.guard";
import { Roles } from "infrastructure/decorators/roles.decorator";
import { RoleEnum } from "infrastructure/enums/role.enum";
import { Public } from "infrastructure/decorators/public.decorator";
import { Page, PageOptions } from "infrastructure/common/page";
import { Response, Request } from "express";

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags("Users")
@Controller("Users")
export class UsersController {
  constructor(private readonly UsersUseCase: IUsersUseCase) {}

  @Roles(RoleEnum.ADMIN)
  @Get()
  @ApiOperation({
    summary: "Find all Users by paging.",
  })
  @ApiOkResponse({
    description: "Users founded.",
    type: PagVM,
    status: 200,
  })
  async getUserspag(
    @Query() query: PaginateQueryVM,
    @Res() res: Response
  ): Promise<Page<Users> | Response> {
    const take = query.take;
    const page = query.pag;
    let result = await this.UsersUseCase.getUsersPag({
      page,
      take,
    } as PageOptions).catch(() => "Error al buscar lista de usuarios");
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
    summary: "Find User of id",
  })
  @ApiParam({
    name: "id",
    required: true,
    description: "Id of user",
    example: "875c18d4-ca31-4eca-a071-7ed942034497",
  })
  @ApiResponse({
    description: "Found User",
    type: UserVM,
    status: 200,
  })
  async getUserById(
    @Param("id") userId: string,
    @Res() res: Response
  ): Promise<UserVM | Response> {
    const result = await this.UsersUseCase.getUserById(userId);
    if (!result) {
      return res.status(HttpStatus.NOT_FOUND).json({
        statusCode: 404,
        message: "Usuario no encontrado",
        data: [],
        meta: null,
      });
    }

    return res.status(HttpStatus.OK).json({
      statusCode: 200,
      message: "Consulta exitosa",
      data: UserVM.toViewModel(result),
      meta: null,
    });
  }

  @Public()
  @Post()
  @ApiOperation({
    summary: "Create user",
  })
  @ApiUnprocessableEntityResponse({
    description: "Validation error while creating User",
    type: UnprocessableEntityError,
  })
  @ApiResponse({
    description: "User created",
    type: UserVM,
    status: 200,
  })
  async created(
    @Body() body: CreateUserVM,
    @Req() request: Request,
    @Res() res: Response
  ): Promise<UserVM | Response> {
    const protocol = request.protocol;
    const host = request.get("host");
    let user = CreateUserVM.fromViewModel(body);
    let existsEmail = await this.UsersUseCase.getUserByUserNameOrEmail(
      body.email
    ).catch(() => "error");
    let existsName = await this.UsersUseCase.getUserByUserNameOrEmail(
      body.userName
    ).catch(() => "error");
    if (existsEmail || existsName) {
      return res.status(HttpStatus.CONFLICT).json({
        statusCode: 409,
        message: existsName ? "Nombre clave existente" : "Email existente",
        data: [],
        meta: null,
      });
    }
    if (!body.role) {
      user.role = RoleEnum.CLIENT;
    }
    if (!body.active) {
      user.active = false;
    }
    user.salt = uuidv4();
    user.password = crypto
      .createHmac("sha256", `${user.salt}${user.phone}${constants.API_SALT}`)
      .digest("hex");
    const result = await this.UsersUseCase.createUser(
      user,
      protocol,
      host
    ).catch(() => "Error al crear el usuario");
    if (typeof result === "string")
      return res
        .status(HttpStatus.CONFLICT)
        .json({ statusCode: 409, message: result, data: [], meta: null });
    return res.status(HttpStatus.CREATED).json({
      statusCode: 201,
      message: "Registro exitoso",
      data: UserVM.toViewModel(result),
      meta: null,
    });
  }

  @Roles(RoleEnum.ADMIN, RoleEnum.CLIENT)
  @Put("/:id")
  @ApiOperation({
    summary: "Update user",
  })
  @ApiUnprocessableEntityResponse({
    description: "Validation error while updating user",
    type: UnprocessableEntityError,
  })
  @ApiParam({
    name: "id",
    description: "Id of user",
    example: "875c18d4-ca31-4eca-a071-7ed942034497",
    type: String,
  })
  @ApiResponse({
    description: "User updated",
    type: UserVM,
    status: 200,
  })
  async update(
    @Param("id") userId: string,
    @Body() body: UpdateUserVM,
    @Res() res: Response
  ): Promise<Users | Response> {
    const exists = await this.UsersUseCase.getUserById(userId);
    if (!exists)
      return res.status(HttpStatus.NOT_FOUND).json({
        statusCode: 404,
        message: "Usuario no encontrado",
        data: [],
        meta: null,
      });
    body.id = userId;
    const existsEmail = await this.UsersUseCase.getUserByUserNameOrEmail(
      body.email
    ).catch(() => "error");
    const existsName = await this.UsersUseCase.getUserByUserNameOrEmail(
      body.userName
    ).catch(() => "error");
    const idEmail =
      typeof existsEmail == "object" ? exists.id == existsEmail.id : false;
    const idName =
      typeof existsName == "object" ? exists.id == existsName.id : false;

    if ((existsEmail && !idEmail) || (existsName && !idName)) {
      return res.status(HttpStatus.CONFLICT).json({
        statusCode: 409,
        message: existsName ? "Nombre clave existente" : "Email existente",
        data: [],
        meta: null,
      });
    }
    const vm = UpdateUserVM.fromViewModel(exists, body);
    const result = await this.UsersUseCase.updateUser(vm).catch(
      () => "No se pudo actualizar"
    );
    if (typeof result === "string")
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
    summary: "Delete a user",
  })
  @ApiUnprocessableEntityResponse({
    description: "Validation error while deleting user",
    type: UnprocessableEntityError,
  })
  @ApiParam({
    name: "id",
    description: "Id of user",
    example: "875c18d4-ca31-4eca-a071-7ed942034497",
    type: String,
  })
  @ApiResponse({
    description: "Removed user",
    type: Object,
    status: 200,
  })
  async delete(
    @Param("id") userId: string
  ): Promise<{ id?: string; message?: string }> {
    const exists = await this.UsersUseCase.getUserById(userId).catch(
      () => "Usuario no encontrado"
    );
    if (!exists || typeof exists === "string")
      return { message: exists || "Usuario no encontrado" } as any;
    const result = await this.UsersUseCase.deleteUser(exists.id).catch(
      () => "El usuario esta siendo usado por otra tabla"
    );
    if (typeof result === "string") return { message: result };
    return { id: exists.id };
  }

  @Public()
  @Get("/all/counter")
  @ApiOperation({
    summary: "Count a user",
  })
  @ApiUnprocessableEntityResponse({
    description: "Count all users",
    type: UnprocessableEntityError,
  })
  @ApiResponse({
    description: "Users couted",
    type: Object,
    status: 200,
  })
  async countUsers(): Promise<number> {
    const result = await this.UsersUseCase.countUser().catch(
      () => "Error al contar Usuarios"
    );
    if (typeof result === "string") return { message: result } as any;
    return result;
  }

  @Public()
  @Get("/:id/validate-register")
  @ApiOperation({
    summary: "Validate User resgistr",
  })
  @ApiUnprocessableEntityResponse({
    description: "Validate User register",
    type: UnprocessableEntityError,
  })
  @ApiResponse({
    description: "User register validated",
    type: Object,
    status: 200,
  })
  async validateRegister(
    @Param("id") userId: string,
    @Res() res
  ): Promise<void> {
    await this.UsersUseCase.validateRegister(userId);
    res.redirect("https://puntoazulpanaderia.online/#/ingreso");
  }

  @Roles(RoleEnum.ADMIN)
  @Get("/reset/date/points")
  @ApiOperation({
    summary: "Reset date to mas use of points",
  })
  @ApiUnprocessableEntityResponse({
    description: "Reset date to mas use of points",
    type: UnprocessableEntityError,
  })
  @ApiResponse({
    description: "Date points reseted",
    type: Object,
    status: 200,
  })
  async initResetDate(@Res() res): Promise<void> {
    await this.UsersUseCase.initResetDate();
    return res.status(HttpStatus.OK).json({
      statusCode: 200,
      message: "Consulta exitosa",
      data: [],
      meta: null,
    });
  }

  @Public()
  @Get("/send/:email/email")
  @ApiOperation({
    summary: "Find User of id",
  })
  @ApiParam({
    name: "email",
    required: true,
    description: "email of user",
    example: "erazo.gustavo@gmail.com",
  })
  @ApiResponse({
    description: "Data User obtained",
    type: UserVM,
    status: 200,
  })
  async getDataUserByEmail(
    @Param("email") email: string,
    @Res() res: Response
  ): Promise<UserVM | Response> {
    await this.UsersUseCase.getDataUserByEmail(email);
    return res.status(HttpStatus.OK).json({
      statusCode: 200,
      message: "Consulta exitosa",
      data: [],
      meta: null,
    });
  }

  @Roles(RoleEnum.ADMIN, RoleEnum.CLIENT)
  @Get("/add/:id/points/:points")
  @ApiOperation({
    summary: "Add points to user",
  })
  @ApiParam({
    name: "id",
    required: true,
    description: "Id of user",
    example: "875c18d4-ca31-4eca-a071-7ed942034497",
  })
  @ApiResponse({
    description: "Found User",
    type: UserVM,
    status: 200,
  })
  async addPoint(
    @Param("id") userId: string,
    @Param("points") points: number,
    @Res() res: Response
  ): Promise<number | Response> {
    const result = await this.UsersUseCase.addPoint(userId, points);
    if (result < 0) {
      return res.status(HttpStatus.NOT_FOUND).json({
        statusCode: 404,
        message: "Error al cargar los puntos",
        data: [],
        meta: null,
      });
    }
    return res.status(HttpStatus.OK).json({
      statusCode: 200,
      message: "Consulta exitosa",
      data: result,
      meta: null,
    });
  }

  @Roles(RoleEnum.CLIENT)
  @Post("/:id/change-pass")
  @ApiOperation({
    summary: "Change pass/phone to user",
  })
  @ApiParam({
    name: "id",
    required: true,
    description: "Id of user",
    example: "875c18d4-ca31-4eca-a071-7ed942034497",
  })
  @ApiResponse({
    description: "Pass User changed",
    type: UserVM,
    status: 200,
  })
  async changePass(
    @Param("id") userId: string,
    @Body("newPass") phone: string,
    @Res() res: Response
  ): Promise<number | Response> {
    const salt = uuidv4();
    const newPass = crypto
      .createHmac("sha256", `${salt}${phone}${constants.API_SALT}`)
      .digest("hex");
    const result = await this.UsersUseCase.changePass(
      userId,
      phone,
      salt,
      newPass
    );
    if (!result) {
      return res.status(HttpStatus.NOT_FOUND).json({
        statusCode: 404,
        message: "Usuario no encontrado",
        data: [],
        meta: null,
      });
    }
    return res.status(HttpStatus.OK).json({
      statusCode: 200,
      message: "Consulta exitosa",
      data: result,
      meta: null,
    });
  }

  @Roles(RoleEnum.ADMIN, RoleEnum.CLIENT)
  @Get("/position/:id/lat/:lat/lon/:lon")
  @ApiOperation({
    summary: "Add last position to user",
  })
  @ApiParam({
    name: "id",
    required: true,
    description: "Id of user",
    example: "875c18d4-ca31-4eca-a071-7ed942034497",
  })
  @ApiResponse({
    description: "Found User",
    type: UserVM,
    status: 200,
  })
  async addLastPosition(
    @Param("id") userId: string,
    @Param("lat") lat: string,
    @Param("lon") lon: string,
    @Res() res: Response
  ): Promise<object | Response> {
    const result = await this.UsersUseCase.addLastPosition(userId, lat, lon);
    return res.status(HttpStatus.OK).json({
      statusCode: 200,
      message: "Consulta exitosa",
      data: result,
      meta: null,
    });
  }

  @Public()
  @Post("/proof/payment")
  @ApiOperation({
    summary: "Send by email payment proof",
  })
  @ApiResponse({
    description: "Payment proof sended",
    type: Response,
    status: 200,
  })
  async sendPayment(
    @Body() body: any,
    @Res() res: Response
  ): Promise<object | Response> {
    const result = await this.UsersUseCase.sendPayment(
      body.nameTo,
      body.emailTo,
      body.amount,
      body.concept
    );
    if (!result) {
      return res.status(HttpStatus.NOT_FOUND).json({
        statusCode: 404,
        message: "Error al enviar comprobante!",
        data: [],
        meta: null,
      });
    }
    return res.status(HttpStatus.OK).json({
      statusCode: 200,
      message: "Operación exitosa!",
      data: result,
      meta: null,
    });
  }
}
