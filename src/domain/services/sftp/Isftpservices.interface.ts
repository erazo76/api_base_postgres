import { Injectable } from "@nestjs/common";
import { Config } from "./models/config";
import { FileSftp } from "./models/file";


@Injectable()
export abstract class IsftpService {

    abstract connect(): Promise<Object>;

    abstract setConfig(config: Config): void;

    abstract getFile(filesRoute: string): Promise<string | Buffer>;

    abstract list(filesRoute: string, pattern?: string): Promise<FileSftp[]>;

    abstract exists(filesRoute: string): Promise<string>;

    abstract put(filePath: string, destinyFilePath: string): Promise<string>;

    abstract move(formFile: string, toFile: string): Promise<any>;

}