import { GetObjectCommandInput, ListObjectsCommandInput, PutObjectCommandOutput } from "@aws-sdk/client-s3";
import { Injectable } from "@nestjs/common";



@Injectable()
export abstract class IS3Service {
    abstract listFiles(args: ListObjectsCommandInput): Promise<any[]>;
    abstract readFile(data: GetObjectCommandInput): Promise<string>;
    abstract uploadFile(data: string, fileName: string, path: string, bucket: string): Promise<PutObjectCommandOutput>;
}