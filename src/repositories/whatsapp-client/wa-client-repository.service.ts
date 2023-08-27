import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { CrudService } from '../repository-helper/crud.service';
import { WaClientResource } from 'src/lib/mongo/schemas/wa-client-resource.schema';
import { OnEvent } from '@nestjs/event-emitter';
import { WA_CLIENT_EVENT_TYPES } from 'src/lib/whatsapp/interfaces/whatsapp-client-events.enum';
import { WaClientQrCodeReceivedEvent, WaClientReadyEvent } from 'src/lib/whatsapp/interfaces/whatsapp-client-events.interfaces';
import { WhatsappService } from 'src/lib/whatsapp/whatsapp.service';
import { WA_CLIENT_STATES } from 'src/lib/mongo/schemas/wa-client-states.enum';

@Injectable()
export class WaClientRepositoryService extends CrudService implements OnModuleInit {

    waService: WhatsappService;

    onModuleInit() {
        this.init(WaClientResource.name);
        this.waService = this.moduleRef.get(WhatsappService, { strict: false });
        this.resetClientStates();
    }

    async resetClientStates() {
        Logger.log(`client states reset`);
        await this.model.updateMany({ state: WA_CLIENT_STATES.Ready }, { state: WA_CLIENT_STATES.Offline });
    }

    async startClient(id: string) {
        const client = await this.findOneAndUpdate({ _id: id }, { state: WA_CLIENT_STATES.Starting });
        if (client) this.waService.initClient(client?._id);

        return client;
    }

    @OnEvent(WA_CLIENT_EVENT_TYPES.QrCodeReceived)
    qrCode(event: WaClientQrCodeReceivedEvent) {
        this.findOneAndUpdate({ _id: event.clientId }, { state: WA_CLIENT_STATES.AwaitingAuthentication, latestQrCode: event.qrCode })
    }

    @OnEvent(WA_CLIENT_EVENT_TYPES.Ready)
    onReady(event: WaClientReadyEvent) {
        this.findOneAndUpdate({ _id: event.clientId }, { state: WA_CLIENT_STATES.Ready })
    }

    @OnEvent(WA_CLIENT_EVENT_TYPES.Disconnected)
    onClose(event: WaClientReadyEvent) {
        this.findOneAndUpdate({ _id: event.clientId }, { state: WA_CLIENT_STATES.Offline })
    }

}
