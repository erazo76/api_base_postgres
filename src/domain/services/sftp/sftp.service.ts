import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { IsftpService } from "./Isftpservices.interface";
import { Config } from "./models/config";
import { FileSftp } from "./models/file";

const fs = require('fs');
const SftpClient = require('ssh2-sftp-client');
const path = require('path')

@Injectable()
export class SftpService implements IsftpService {
    /** Sftp connection protocol object */
    private sftp = new SftpClient();

    /** Configure the sftp connection model */
    private config: Config = {
        host: 'sftp.dotersservices.com',
        port: 22,
        username: 'ms-bucket-conciliatory-dev',
        privateKey: fs.readFileSync(path.resolve('./id_rsa')),
    };

    constructor() {
        this.connect();
    }

    setConfig(config: Config): void {
        this.config = config;
    }

    async connect(): Promise<Object> {
        try {
            await this.sftp.connect(this.config);
            return this.sftp;
        } catch (error) {
            Logger.log(error);
        }
    }

    async getFile(filesRoute: string): Promise<string | Buffer> {
        return new Promise(async (resolve, reject) => {
            try {
                const filesData = this.sftp.get(filesRoute);
                resolve(filesData);
            } catch (error) {
                reject(error);
            }
        });
    }

    async list(filesRoute: string, pattern?: string): Promise<FileSftp[]> {
        // await this.connect();
        const list: FileSftp[] = await new Promise(async (resolve, reject) => {
            try {
                const dataPatther = (pattern ? this.sftp.list(filesRoute, pattern) : this.sftp.list(filesRoute)) ?? [];
                resolve(dataPatther);
            } catch (error) {
                reject(error);
            }
        })
        // await this.sftp.end();
        return list;
    }

    async move(formFile: string, ofFile: string): Promise<any> {
        // await this.connect();
        const list: FileSftp[] = await new Promise(async (resolve, reject) => {
            try {
                const dataPatther = this.sftp.rename(formFile, ofFile);
                resolve(dataPatther);
            } catch (error) {
                reject(error);
            }
        })
        // await this.sftp.end();
        return list;
    }

    async exists(filesRoute: string): Promise<string> {
        return new Promise(async (resolve, reject) => {
            try {
                const dataPatther = this.sftp.exists(filesRoute);
                resolve(dataPatther);
            } catch (error) {
                reject(error);
            }
        })
    }

    async put(filePath: string, destinyFilePath: string): Promise<string> {
        return new Promise(async (resolve, reject) => {
            try {
                const dataPatther = this.sftp.put(filePath, destinyFilePath);
                resolve(dataPatther);
            } catch (error) {
                reject(error);
            }
        })
    }

}