import { Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { getTagName } from 'src/lib/swagger/swagger-tags';
import { WaClientRepositoryService } from 'src/repositories/whatsapp-client/wa-client-repository.service';

@ApiTags(getTagName('whatsapp-client'))
@Controller('client')
export class WaClientControllerController {


    constructor(private waClinetrepo: WaClientRepositoryService) { }

    @Get('')
    getClients() {
        return this.waClinetrepo.find();
    }

    @Get(':id')
    getClient(@Param('id') id: string) {
        return this.waClinetrepo.findOneById(id);
    }

    @Post(':id')
    @ApiOperation({ summary: 'Create a new client instance' })
    initClient() {
        console.log('creating new client')
    }
}
