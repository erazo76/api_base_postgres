import { Expose } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class PagVM<T> {
  @Expose()
  @ApiProperty({
    description: "all data for pagine",
    example: [{ id: "id" }, { id: "id" }],
    type: Object,
  })
  data: T[];

  @Expose()
  @ApiProperty({
    description: "number of data row",
    example: "1",
    type: Number,
  })
  count: number;

  static toViewModel<T>(data: T[], count: number): PagVM<T> {
    let result = new PagVM<T>();
    result.count = count;
    result.data = data;
    return result;
  }
}
