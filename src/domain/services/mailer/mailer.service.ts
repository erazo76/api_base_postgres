import * as nodemailer from "nodemailer";
import { Injectable, Logger } from "@nestjs/common";
import * as handlebars from "handlebars";
import * as fs from "fs";
import path from "path";
import { mailerConfig } from "./mailer.config";

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private confirmationTemplate: handlebars.TemplateDelegate;
  private confirmationTemplateB: handlebars.TemplateDelegate;
  private passwordResetTemplate: handlebars.TemplateDelegate;
  private groupInviteTemplate: handlebars.TemplateDelegate;
  constructor() {
    this.transporter = nodemailer.createTransport(mailerConfig, {
      from: {
        name: "Panadería Punto Azul",
        address: "puntoazulpanaderia@gmail.com",
      },
    });
    this.confirmationTemplate = this.renderTemplate("punto-azul.hbs");
    this.confirmationTemplateB = this.renderTemplate("punto-azul-B.hbs");
  }

  logger: Logger = new Logger("MailerService");

  private renderTemplate(templateName: string): handlebars.TemplateDelegate {
    const filePath = path.resolve(`./template/${templateName}`);
    try {
      const source = fs.readFileSync(filePath, "utf-8");
      return handlebars.compile(source);
    } catch (error) {
      console.error("Error rendering template: ", error);
      throw error;
    }
  }

  async sendEMail(receiverEmail: string, subject: string, context: any) {
    try {
      const html = this.confirmationTemplate(context);
      await this.transporter.sendMail({
        to: receiverEmail,
        subject: subject,
        html: html,
      });

      return true;
    } catch (error) {
      console.error("Error sending email: ", error);
      return false;
    }
  }

  async sendEMailB(receiverEmail: string, subject: string, context: any) {
    try {
      const html = this.confirmationTemplateB(context);
      await this.transporter.sendMail({
        to: receiverEmail,
        subject: subject,
        html: html,
      });

      return true;
    } catch (error) {
      console.error("Error sending email: ", error);
      return false;
    }
  }
}
