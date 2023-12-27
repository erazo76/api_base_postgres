// sse.controller.ts
import { Controller, Sse, MessageEvent } from "@nestjs/common";
import { IPurchasesUseCase } from "application/ports/UseCases/PurchasesUseCase/IPurchasesUseCase.interface";

import { Observable } from "rxjs";

@Controller("sse")
export class SSEController {
  constructor(private readonly PurchasesUseCase: IPurchasesUseCase) {}

  @Sse("sse")
  async sse(): Promise<Observable<MessageEvent>> {
    const process = await this.PurchasesUseCase.counterSse();
    return process;
  }
}
