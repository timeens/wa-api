import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type AuditResourceDocument = AuditResource & Document;

@Schema({ timestamps: true })
export class AuditResource {

    @Prop({ type: String, index: true })
    reference: string;

    @Prop({ type: Number })
    version: number;

    @Prop({ type: Object })
    doc: any;

    //     @Prop({ type: String, ref: UserResource.name, autopopulate: true })
    //     actionUser: string;
}

export const AuditResourceSchema = SchemaFactory.createForClass(AuditResource);