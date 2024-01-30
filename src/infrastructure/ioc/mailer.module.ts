import { MailerModule } from "@nestjs-modules/mailer";
import { Module } from "@nestjs/common";
import { mailerConfig } from "domain/services/mailer/mailer.config";
import { MailService } from "domain/services/mailer/mailer.service";

@Module({
  controllers: [],
  imports: [MailerModule.forRoot(mailerConfig)],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
