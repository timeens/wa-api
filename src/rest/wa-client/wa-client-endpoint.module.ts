import { Module } from '@nestjs/common';
import { WaClientControllerController } from './wa-client-controller.controller';
import { WaClientRepositoryModule } from 'src/repositories/whatsapp-client/wa-client-repository.module';

@Module({
    imports: [WaClientRepositoryModule],
    controllers: [WaClientControllerController],
    providers: [],
})
export class ClientEndpointModule { }
