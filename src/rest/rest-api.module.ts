import { ClientEndpointModule } from './wa-client/wa-client-endpoint.module';
import { Module } from "@nestjs/common";

const ENDPOINT_MODULES = [
    ClientEndpointModule
]

@Module({
    imports: [
        ...ENDPOINT_MODULES,
    ],
    providers: [
        // global interceptors
    ]
})
export class RestApiModule { }
