import { Expose } from 'class-transformer';
import { ApiProperty } from "@nestjs/swagger";

export class ResponseVM<T> {
    @Expose()
    @ApiProperty({
        description: "Status of request",
        example: "1",
        type: Boolean,
    })
    success: boolean;

    @Expose()
    @ApiProperty({
        description: "Status Code of request",
        example: "1",
        type: Number,
    })
    status: number;

    @Expose()
    @ApiProperty({
        description: "Status of request",
        example: "1",
        type: String,
    })
    message: string;

    @Expose()
    @ApiProperty({
        description: "all data for pagine",
        example: [{ id: "id" }, { id: "id" }],
        type: Object
    })
    payload: T;

    static toViewModel<T>(success: boolean, status: number, message?: string, data?: T): ResponseVM<T> {
        let result = new ResponseVM<T>();
        result.success = success;
        result.status = status;
        result.message = message ?? "";
        result.payload = data
        return result;
    }
}