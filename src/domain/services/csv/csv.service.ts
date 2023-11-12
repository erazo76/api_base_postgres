import { Injectable, Logger } from '@nestjs/common';
import { ICSVService } from "./IcsvService.interface";
import { createObjectCsvWriter } from 'csv-writer'

const fs = require('fs');
const path = require('path')

@Injectable()
export class CSVService implements ICSVService {

    async CreateFile(name: string, data: any): Promise<any> {
        return new Promise((resolve, reject) => {
            let headers: { id: string, title: string }[] = [];
            Object.keys(data[0]).forEach((key) => {
                headers.push({
                    id: key,
                    title: key
                })
            })

            let finalFilePath = `${path.resolve('./tmp/fileOutput')}/${name}`;
            Logger.log(finalFilePath);
            const csvWriter = createObjectCsvWriter({
                path: finalFilePath,
                header: headers
            });
            fs.writeFile(finalFilePath, 'Learn Node FS module', function (err) {
                if (err) {
                    Logger.log("Create Error")
                    reject(err);
                }
                csvWriter.writeRecords(data).then(() => {
                    resolve(finalFilePath);
                }, (error) => {
                    Logger.log("write error")
                    reject(error);
                })
            });
        })
    }
}