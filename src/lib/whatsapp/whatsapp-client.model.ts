import { Logger } from '@nestjs/common';
import { SendWaMessageDto } from 'src/rest/wa-client/dto/send-wa-message.dto';
import { Client } from "whatsapp-web.js";

export class WhatsappClient {

    constructor(private clientId: string, private client: Client) {
    }

    getInfo() {
        return this.client.info;
    }

    async sendMessage(data: SendWaMessageDto) {
        const chatId = this.getChatIdByPhoneNumber(data.recipient);
        if (!await this.isRegisteredUser(chatId)) return null;

        Logger.log(`Sending msg to ${chatId} => ${data.body}`);
        return this.client.sendMessage(chatId, data.body);
    }

    isRegisteredUser(strippedNb) {
        return this.client.isRegisteredUser(strippedNb);
    }

    getChatIdByPhoneNumber(rawNumber: string) {
        return rawNumber.replace('+', '') + "@c.us";
    }
}