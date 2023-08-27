import { AuditResourceSchema } from './audit-resource.schema';
import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';

@Injectable()
export class MongoService {

    constructor(@InjectConnection() private con: Connection) {
    }

    getModel(modelName: string): Model<any> {
        const model = this.getModelFromConnection(modelName);
        if (!model) throw new Error(`Trying to load mongoose model ${modelName}, does it exists and has it been imported?`);

        return model;
    };


    getAuditModel(modelName: string) {
        const baseModel = this.getModelFromConnection(modelName);
        const auditModelName = `${modelName}_audit`;
        // check if audit model is already loaded
        let auditModel = this.getModelFromConnection(auditModelName);
        // load model if not available
        if (!auditModel) auditModel = this.con.model(auditModelName, AuditResourceSchema, `${baseModel.collection.name}_audit`);

        return auditModel;
    }


    private getModelFromConnection(modelName: string) {
        modelName.toLowerCase();
        modelName = `${modelName.charAt(0).toLocaleUpperCase()}${modelName.slice(1)}`;

        return this.con.models[modelName] || null;
    }
}