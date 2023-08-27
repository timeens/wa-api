import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseResourceSchema } from '../base-resource.schema';
import { WA_CLIENT_STATES } from './wa-client-states.enum';

export type WaClientResourceDocument = WaClientResource & Document;
@Schema({ timestamps: true, collection: 'wa_clients' })
export class WaClientResource extends BaseResourceSchema {

    @Prop({ type: String, required: true, unique: true })
    identifier: string;

    @Prop({ type: String, required: true, default: WA_CLIENT_STATES.AwaitingAuthentication })
    state: string;

    @Prop({ type: String })
    latestQrCode: string;

}

export const WaClientResourceSchema = SchemaFactory.createForClass(WaClientResource);