import { WhatsappService } from './whatsapp.service';
import { Module } from '@nestjs/common';

@Module({
    providers: [WhatsappService],
    exports: [WhatsappService]
})
export class WhatsappModule { }
