import { Expose } from "class-transformer";

export class FileVM {
  @Expose()
  fileUrl: string;

  @Expose()
  fileName: string;
}
