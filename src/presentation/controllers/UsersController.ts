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
  async getUserspag(@Query() query: PaginateQueryVM): Promise<PagVM<UserVM>> {
    const take = query.take;
    const page = query.pag;
    const result = await this.UsersUseCase.getUsersPag(take, (page - 1) * take);
    const metarules = result[0].map((item) => UserVM.toViewModel(item));
    return PagVM.toViewModel<UserVM>(metarules, result[1]);
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
  async getUserById(@Param("id") userId: string): Promise<UserVM> {
    const result = await this.UsersUseCase.getUserById(userId).catch(
      () => "Error al buscar el usuario"
    );
    if (typeof result === "string") return { message: result } as any;
    return UserVM.toViewModel(result);
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
  async created(@Body() body: CreateUserVM): Promise<UserVM> {
    let user = CreateUserVM.fromViewModel(body);
    let existsEmail = await this.UsersUseCase.getUserByUserNameOrEmail(
      body.email
    ).catch(() => "error");
    let existsName = await this.UsersUseCase.getUserByUserNameOrEmail(
      body.userName
    ).catch(() => "error");
    if (existsEmail || existsName) {
      return {
        message: existsName ? "UserName existente" : "Email existente",
      } as any;
    }
    if (!body.role) {
      user.role = RoleEnum.CLIENT;
    }
    if (!body.active) {
      user.active = true;
    }
    user.salt = uuidv4();
    user.password = crypto
      .createHmac("sha256", `${user.salt}${user.phone}${constants.API_SALT}`)
      .digest("hex");
    const result = await this.UsersUseCase.createUser(user).catch(
      () => "Error al crear el usuario"
    );
    if (typeof result === "string") return { message: result } as any;
    return result;
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
    @Body() body: UpdateUserVM
  ): Promise<Users> {
    const exists = await this.UsersUseCase.getUserById(userId).catch(
      () => "Usuario no encontrado"
    );
    if (!exists || typeof exists === "string")
      return { message: "Usuario no encontrado" } as any;
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
      return {
        message: existsName ? "UserName existente" : "Email existente",
      } as any;
    }
    const vm = UpdateUserVM.fromViewModel(exists, body);
    const result = await this.UsersUseCase.updateUser(vm).catch(
      () => "No se pudo actualizar"
    );
    if (typeof result === "string") return { message: result } as any;
    return vm;
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
}
