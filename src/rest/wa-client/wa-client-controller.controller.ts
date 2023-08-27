import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { getTagName } from 'src/lib/swagger/swagger-tags';
import { WaClientRepositoryService } from 'src/repositories/whatsapp-client/wa-client-repository.service';
import { CreateWaClientDto } from './dto/create-wa-client.dto';
import { TransformerConfig } from '../interceptors/transformer.interceptor';
import { WaClientTransformer } from './transformer/wa-client.transformer';
import { UrlParamValidationConfig } from '../interceptors/url-param-item-exists.interceptor';
import { WaClientResource } from 'src/lib/mongo/schemas/wa-client-resource.schema';

@ApiTags(getTagName('whatsapp-client'))
@Controller('client')
@TransformerConfig({ transformer: WaClientTransformer })
@UrlParamValidationConfig([{ param: 'id', existsInDbResource: WaClientResource.name }])
export class WaClientControllerController {

    constructor(private waClientRepo: WaClientRepositoryService) { }

    @Get('')
    @ApiOkResponse({ type: [WaClientTransformer] })
    @ApiOperation({ summary: 'Find clients' })
    getClients() {
        return this.waClientRepo.find();
    }

    @Get(':id')
    @ApiParam({ name: 'id' })
    @ApiParam({ name: 'id' })
    @ApiOperation({ summary: 'Get client details' })
    @ApiOkResponse({ type: WaClientTransformer })
    getClient(@Param('id') id: string) {
        return this.waClientRepo.findOneById(id);
    }

    @Post(':id/start')
    @ApiParam({ name: 'id' })
    @ApiOperation({ summary: 'Start an existing client instance' })
    @ApiOkResponse({ type: WaClientTransformer })
    startClient(@Param('id') id: string) {
        return this.waClientRepo.startClient(id);
    }

    @Post('')
    @ApiOperation({ summary: 'Create a new client' })
    @ApiOkResponse({ type: WaClientTransformer })
    initClient(@Body() body: CreateWaClientDto) {
        return this.waClientRepo.create(body);
    }
}
