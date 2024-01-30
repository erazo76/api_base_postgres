import { Injectable, Logger } from "@nestjs/common";
import { MailerService } from "@nest-modules/mailer";
import * as fs from "fs";
import path from "path";
import Handlebars from "handlebars";

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  logger: Logger = new Logger("MailerService");

  async renderTemplate(templateName: string, context: any): Promise<string> {
    const filePath = path.resolve(`./template/${templateName}.hbs`);

    try {
      const source = fs.readFileSync(filePath, "utf-8");
      const template = Handlebars.compile(source);
      const renderedContent = template(context);
      return renderedContent;
    } catch (error) {
      console.error("Error rendering template: ", error);
      throw error;
    }
  }

  async sendEMail(
    receiverEmail: string,
    subject: string,
    templateName: string,
    context: any
  ) {
    try {
      const renderedContent = await this.renderTemplate(templateName, context);

      await this.mailerService.sendMail({
        to: receiverEmail,
        subject: subject,
        html: renderedContent,
        context: context,
      });

      return true;
    } catch (error) {
      console.error("Error sending email: ", error);
      return false;
    }
  }
}
