import {
  Module,
  CacheModule,
  CacheInterceptor,
  HttpModule,
} from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { TerminusModule } from "@nestjs/terminus";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CacheService } from "infrastructure/cache";
import { setEnvironment } from "infrastructure/environments";
import { HealthController } from "infrastructure/terminus/index";
import { SftpService } from "domain/services/sftp/sftp.service";
import { ScheduleModule } from "@nestjs/schedule";
import { CSVService } from "domain/services/csv/csv.service";
import { HttpsService } from "domain/services/https/https.service";
import { ICSVService } from "domain/services/csv/IcsvService.interface";
import { IHttpService } from "domain/services/https/IhttpsService.interface";
import { IsftpService } from "domain/services/sftp/Isftpservices.interface";
import { UsersModule } from "infrastructure/ioc/users.module";
import { IUsersRepository } from "application/ports/Repository/UsersRepository/IUsersRepository.interface";
import { UsersRepository } from "infrastructure/database/repositories/Users.repository";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { LocalStrategy } from "infrastructure/strategies/local.strategy";
import { JwtStrategy } from "infrastructure/strategies/jwt.strategy";
import { constants } from "domain/shared/constants";
import { IS3Service } from "domain/services/s3/IS3Service,.interface";
import { S3Service } from "domain/services/s3/s3.service";
import { UsersUseCase } from "application/use-cases/UsersUseCase/UsersUseCase";
import { IUsersUseCase } from "application/ports/UseCases/UsersUseCase/IUsersUseCase.interface";
import { CategoriesModule } from "infrastructure/ioc/categories.module";
import { AuthModule } from "infrastructure/ioc/auth.module";
import { IAuthUseCase } from "application/ports/UseCases/AuthUseCase/IAuthUseCase.interface";
import { AuthUseCase } from "application/use-cases/AuthUseCase/AuthUseCase";
import { ProductsModule } from "infrastructure/ioc/products.module";
import { PurchasesModule } from "infrastructure/ioc/purchases.module";
import { PurchaseDetailsModule } from "infrastructure/ioc/purchaseDetails.module";
import { FilesModule } from "infrastructure/ioc/files.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      envFilePath: setEnvironment(),
    }),
    TypeOrmModule.forRoot(),
    CacheModule.registerAsync({
      useClass: CacheService,
    }),
    ScheduleModule.forRoot(),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    JwtModule.register({
      secretOrPrivateKey: `${constants.API_JWT_SECRET}`,
      secret: `${constants.API_JWT_SECRET}`,
      signOptions: { expiresIn: "24h" },
    }).module,

    TerminusModule,
    //Modules IOC
    UsersModule,
    CategoriesModule,
    ProductsModule,
    PurchasesModule,
    PurchaseDetailsModule,
    FilesModule,
    AuthModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
    { provide: IS3Service, useClass: S3Service },
    { provide: ICSVService, useClass: CSVService },
    { provide: IsftpService, useClass: SftpService },
    { provide: IHttpService, useClass: HttpsService },
    { provide: IUsersRepository, useClass: UsersRepository },
    { provide: IUsersRepository, useClass: UsersRepository },
    {
      provide: IUsersUseCase,
      useClass: UsersUseCase,
    },
    {
      provide: IAuthUseCase,
      useClass: AuthUseCase,
    },
    JwtService,
    LocalStrategy,
    JwtStrategy,
  ],
})
export class AppModule {}
