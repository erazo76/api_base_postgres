import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class ICSVService {
    abstract CreateFile(name: string, data: any): Promise<any>;
}