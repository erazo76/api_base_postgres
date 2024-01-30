import { Module } from "@nestjs/common";
import { MailService } from "domain/services/mailer/mailer.service";

@Module({
  controllers: [],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
