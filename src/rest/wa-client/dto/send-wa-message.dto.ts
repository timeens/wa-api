import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class SendWaMessageDto {

    @ApiProperty()
    @IsNotEmpty()
    recipient: string;

    @ApiProperty()
    @IsNotEmpty()
    body: string;

}