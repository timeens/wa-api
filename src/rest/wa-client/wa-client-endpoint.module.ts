import { Module } from '@nestjs/common';
import { WaClientRepositoryModule } from 'src/repositories/whatsapp-client/wa-client-repository.module';
import { WaClientController } from './wa-client.controller';

@Module({
    imports: [WaClientRepositoryModule],
    controllers: [WaClientController],
    providers: [],
})
export class ClientEndpointModule { }
