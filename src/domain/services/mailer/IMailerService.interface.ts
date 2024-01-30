import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class IMailerService {
  abstract sendEMail(
    receiverEmail: string,
    subject: string,
    content: string
  ): Promise<any>;
}
