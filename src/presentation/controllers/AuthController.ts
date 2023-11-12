import { Controller, Post, Request, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { IAuthUseCase } from "application/ports/UseCases/AuthUseCase/IAuthUseCase.interface";
import { LocalAuthGuard } from "infrastructure/guards/auth.guard";

@ApiTags("Auth")
@Controller("Auth")
export class AuthController {
  constructor(private readonly AuthUseCase: IAuthUseCase) {}
  @UseGuards(LocalAuthGuard)
  @ApiOperation({
    summary: "Login",
  })
  @Post("login")
  login(@Request() req) {
    return this.AuthUseCase.login(req.user);
  }
}
