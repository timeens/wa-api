import { ApiProperty } from "@nestjs/swagger";

export class CreateWaClientDto {

    @ApiProperty()
    identifier: string;

}