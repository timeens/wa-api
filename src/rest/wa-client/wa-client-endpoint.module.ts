import { Module } from '@nestjs/common';
import { WaClientRepositoryModule } from 'src/repositories/whatsapp-client/wa-client-repository.module';
import { WaClientController } from './wa-client.controller';
import { WaClientMessageController } from './wa-client-message.controller';

@Module({
    imports: [WaClientRepositoryModule],
    controllers: [
        WaClientController,
        WaClientMessageController
    ]
})
export class ClientEndpointModule { }
