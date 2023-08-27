import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseResourceSchema } from '../base-resource.schema';

export type WaClientResourceDocument = WaClientResource & Document;
@Schema({ timestamps: true, collection: 'wa_clients' })
export class WaClientResource extends BaseResourceSchema {

    @Prop({ type: String, required: true })
    state: string;

}

export const WaClientResourceSchema = SchemaFactory.createForClass(WaClientResource);