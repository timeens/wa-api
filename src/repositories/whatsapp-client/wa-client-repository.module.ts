import { Module } from '@nestjs/common';
import { MongoResourceModule } from 'src/lib/mongo/mongo-resource.module';
import { WaClientRepositoryService } from './wa-client-repository.service';
import { WhatsappModule } from 'src/lib/whatsapp/whatsapp.module';

@Module({
    imports: [MongoResourceModule, WhatsappModule],
    providers: [WaClientRepositoryService],
    exports: [WaClientRepositoryService],
})
export class WaClientRepositoryModule { }
