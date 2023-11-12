import { Test } from "@nestjs/testing";
import { CSVService } from "domain/services/csv/csv.service";
import { ICSVService } from "domain/services/csv/IcsvService.interface";
import * as Cocw from 'csv-writer';
import fs from 'fs';
const path = require('path')

describe('ICSVservice', () => {
    let service: ICSVService;
    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                {
                    provide: ICSVService,
                    useClass: CSVService
                }
            ]
        }).compile()
        service = module.get(ICSVService);
    })

    it('test CreateFile', async () => {
        const data = { id: "1" }
        jest.mock('fs', () => ({
            writeFile: () => jest.fn()
        }));
        jest.spyOn(fs, "writeFile").mockImplementation((path, text, call: any) => {
            call({ err: "eror" } as any);
        });
        try {
            await service.CreateFile("prueba", [data]);
        } catch (error) {
            expect(error).toStrictEqual({ err: "eror" })
        }

        jest.spyOn(fs, "writeFile").mockReset()
        jest.spyOn(fs, "writeFile").mockImplementation((path, text, call: any) => {
            call(null);
        });
        jest.spyOn(Cocw, "createObjectCsvWriter").mockImplementationOnce(() => (
            {
                writeRecords: () => new Promise((resolve, reject) => {
                    resolve(true);
                })
            }) as any);
        const result = await service.CreateFile("prueba", [data]);
        expect(result).toBe(`${path.resolve('./tmp/fileOutput')}/prueba`);

        jest.spyOn(Cocw, "createObjectCsvWriter").mockImplementationOnce(() => (
            {
                writeRecords: () => new Promise((resolve, reject) => {
                    reject("error");
                })
            }) as any);

        await service.CreateFile("prueba", [data]).catch((err) => {
            expect(err).toBe("error");
        });
    })
})