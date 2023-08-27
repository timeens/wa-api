import { Module } from '@nestjs/common';
import { MongoResourceModule } from 'src/lib/mongo/mongo-resource.module';
import { WaClientRepositoryService } from './wa-client-repository.service';

@Module({
    imports: [MongoResourceModule],
    providers: [WaClientRepositoryService],
    exports: [WaClientRepositoryService],
})
export class WaClientRepositoryModule { }