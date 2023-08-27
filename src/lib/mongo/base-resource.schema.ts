import { Prop, Schema } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
@Schema()
export abstract class BaseResourceSchema {
    @Prop({ type: String, ref: 'UserResource', autopopulate: false })
    createdBy: string;
    @Prop({ type: String, ref: 'UserResource', autopopulate: false })
    updatedBy: string;
    @Prop({ type: String, ref: 'UserResource', autopopulate: false })
    deletedBy: string;
    @Prop({ type: Date })
    deletedAt: string;
}