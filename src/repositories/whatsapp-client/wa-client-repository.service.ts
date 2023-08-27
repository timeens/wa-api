import { Injectable, OnModuleInit } from '@nestjs/common';
import { CrudService } from '../repository-helper/crud.service';
import { WaClientResource } from 'src/lib/mongo/schemas/wa-client-resource.schema';

@Injectable()
export class WaClientRepositoryService extends CrudService implements OnModuleInit {

    onModuleInit() {
        this.init(WaClientResource.name);
    }
}
