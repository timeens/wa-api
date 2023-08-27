import { Client, LocalAuth } from 'whatsapp-web.js';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

export enum WA_CLIENT_EVENT_TYPES {
    QrCodeReceived = 'qr',
    Authenticated = 'authenticated',
    AuthFailure = 'auth_failure',
    Message = 'message',
}

@Injectable()
export class WhatsappService {

    constructor(private eventEmitter: EventEmitter2) { }

    initClient(clientId: string, config = { headless: false }) {
        const client = new Client({
            puppeteer: { headless: config.headless }, // Make headless true or remove to run browser in background
            authStrategy: new LocalAuth({ clientId, dataPath: './sessions' })
        });

        // emit events
        client.on(WA_CLIENT_EVENT_TYPES.QrCodeReceived, (qr) => this.eventEmitter.emit(WA_CLIENT_EVENT_TYPES.QrCodeReceived, { clientId, qr }));
        client.on(WA_CLIENT_EVENT_TYPES.Authenticated, () => this.eventEmitter.emit(WA_CLIENT_EVENT_TYPES.QrCodeReceived, { clientId }));
        client.on(WA_CLIENT_EVENT_TYPES.AuthFailure, () => this.eventEmitter.emit(WA_CLIENT_EVENT_TYPES.QrCodeReceived, { clientId }));
        client.on(WA_CLIENT_EVENT_TYPES.Message, (msg) => this.eventEmitter.emit(WA_CLIENT_EVENT_TYPES.QrCodeReceived, { clientId, msg }));

        client.initialize();
    }

}
