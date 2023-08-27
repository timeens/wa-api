import { Controller, BadRequestException, Param, Post, Body } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { getTagName } from 'src/lib/swagger/swagger-tags';
import { TransformerConfig } from '../interceptors/transformer.interceptor';
import { WaClientTransformer } from './transformer/wa-client.transformer';
import { UrlParamValidationConfig } from '../interceptors/url-param-item-exists.interceptor';
import { WaClientResource } from 'src/lib/mongo/schemas/wa-client-resource.schema';
import { SendWaMessageDto } from './dto/send-wa-message.dto';
import { WaClientRepositoryService } from 'src/repositories/whatsapp-client/wa-client-repository.service';
import { WaMessageTransformer } from './transformer/wa-message.transformer';

@ApiTags(getTagName('whatsapp-client'))
@Controller('client/:clientId/message')
@UrlParamValidationConfig([{ param: 'clientId', existsInDbResource: WaClientResource.name }])
export class WaClientMessageController {

    constructor(private waClient: WaClientRepositoryService) { }

    @Post('send')
    @TransformerConfig({ transformer: WaMessageTransformer })
    @ApiOkResponse({ type: WaMessageTransformer })
    @ApiOperation({ summary: 'Send Message' })
    getChats(@Param('clientId') clientId: string, @Body() body: SendWaMessageDto) {
        const client = this.waClient.getClient(clientId);
        if (!client) throw new BadRequestException('Client not in pool');

        return client.sendMessage(body);
    }
}
