import { Injectable, Logger } from "@nestjs/common";
import {
  S3,
  ListObjectsCommandInput,
  PutObjectCommandOutput,
  PutObjectCommandInput,
  GetObjectCommandInput,
} from "@aws-sdk/client-s3";
import { IS3Service } from "./IS3Service,.interface";

@Injectable()
export class S3Service extends S3 implements IS3Service {
  constructor() {
    super({});
  }

  logger: Logger = new Logger("S3Service");

  private streamToString = (stream): Promise<string> =>
    new Promise((resolve, reject) => {
      const chunks = [];
      stream.on("data", (chunk) => chunks.push(chunk));
      stream.on("error", reject);
      stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    });

  public async listFiles(args: ListObjectsCommandInput): Promise<any[]> {
    try {
      this.logger.log("Get all files");
      const files = await this.listObjects(args);
      return files.Contents || [];
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  public async readFile(data: GetObjectCommandInput): Promise<string> {
    try {
      this.logger.log("reading file content");
      const file = await this.getObject(data);
      const stream = file.Body;
      return await this.streamToString(stream);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  public async uploadFile(
    data: string,
    fileName: string,
    path: string,
    bucket: string
  ): Promise<PutObjectCommandOutput> {
    try {
      this.logger.log("Upload File");
      const args: PutObjectCommandInput = {
        Bucket: bucket,
        Key: `${path}${fileName}`,
        Body: Buffer.from(data),
      };
      const uploadResult = await this.putObject(args);
      this.logger.log(`File Uploaded ${fileName}`);
      return uploadResult;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
