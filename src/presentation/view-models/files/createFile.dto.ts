import { Expose } from "class-transformer";
import { IsByteLength, IsOptional, IsString } from "class-validator";

export class UploadFileVM {
  @IsString()
  @IsOptional()
  @IsByteLength(1, 200)
  @Expose()
  fileUrl?: string;

  @IsString()
  @IsByteLength(1, 250)
  @IsOptional()
  @Expose()
  fileName?: string;

  @IsString()
  @IsOptional()
  @Expose()
  bucket?: string;
}
