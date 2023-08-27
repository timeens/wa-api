import { WA_CLIENT_STATES } from "src/lib/mongo/schemas/wa-client-states.enum";
import { ApiPropertyExposed } from "src/rest/interceptors/transformer.interceptor";

export class WaClientTransformer {

    @ApiPropertyExposed()
    id: string;

    @ApiPropertyExposed()
    identifier: string;

    @ApiPropertyExposed({ enum: Object.values(WA_CLIENT_STATES) })
    state: string;
}