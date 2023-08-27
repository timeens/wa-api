import { Client, LocalAuth } from 'whatsapp-web.js';
import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { WA_CLIENT_EVENT_TYPES } from './interfaces/whatsapp-client-events.enum';
import { WaClientAuthFailureEvent, WaClientAuthenticatedEvent, WaClientDisconnectedEvent, WaClientMessageEvent, WaClientQrCodeReceivedEvent, WaClientReadyEvent } from './interfaces/whatsapp-client-events.interfaces';

@Injectable()
export class WhatsappService implements OnModuleDestroy {

    private clientPool: Array<{ clientId: string, client: Client }> = [];

    constructor(private eventEmitter: EventEmitter2) { }

    initClient(clientId: string, config = { headless: false }) {
        const client = new Client({
            puppeteer: { headless: config.headless }, // Make headless true or remove to run browser in background
            authStrategy: new LocalAuth({ clientId, dataPath: './sessions' })
        });

        // emit events
        client.on(WA_CLIENT_EVENT_TYPES.QrCodeReceived, (qrCode) => {
            const event: WaClientQrCodeReceivedEvent = { clientId, qrCode, }
            this.eventEmitter.emit(WA_CLIENT_EVENT_TYPES.QrCodeReceived, event);
        });
        client.on(WA_CLIENT_EVENT_TYPES.Authenticated, () => {
            const event: WaClientAuthenticatedEvent = { clientId };
            this.eventEmitter.emit(WA_CLIENT_EVENT_TYPES.Authenticated, event);
        });
        client.on(WA_CLIENT_EVENT_TYPES.AuthFailure, () => {
            const event: WaClientAuthFailureEvent = { clientId };
            this.eventEmitter.emit(WA_CLIENT_EVENT_TYPES.AuthFailure, event);
        });
        client.on(WA_CLIENT_EVENT_TYPES.Message, (msg) => {
            const event: WaClientMessageEvent = { clientId, message: msg };
            this.eventEmitter.emit(WA_CLIENT_EVENT_TYPES.Message, event);
        });
        client.on(WA_CLIENT_EVENT_TYPES.Ready, () => {
            const event: WaClientReadyEvent = { clientId };
            this.pushClientToPool(clientId, client);
            this.eventEmitter.emit(WA_CLIENT_EVENT_TYPES.Ready, event);
        });
        client.on(WA_CLIENT_EVENT_TYPES.Disconnected, () => {
            const event: WaClientDisconnectedEvent = { clientId };
            this.pullClientFromPool(clientId);
            this.eventEmitter.emit(WA_CLIENT_EVENT_TYPES.Disconnected, event);
        });


        client.initialize();
    }

    private pushClientToPool(clientId: string, client: Client) {
        this.clientPool.push({ clientId, client });
        Logger.log(`New Client ${clientId} added to pool (Poolsize: ${this.currentPoolSize})`);
    }

    private pullClientFromPool(clientId: string) {
        this.clientPool = this.clientPool.filter(c => c.clientId !== clientId);
        Logger.log(`Client ${clientId} removed from pool (Poolsize: ${this.currentPoolSize})`);
    }

    getClient(clientId) {
        return this.clientPool.find(p => p.clientId === clientId) || null;
    }

    get currentPoolSize() {
        return this.clientPool.length;
    }


    onModuleDestroy() {
        this.clientPool.map(c => c.client.destroy());
    }
}
