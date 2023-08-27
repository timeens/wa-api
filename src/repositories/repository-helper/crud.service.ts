import { MongoService } from '../../lib/mongo/mongo.service';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export abstract class CrudService {

    protected model: Model<any>;
    protected populate: string[] = [];

    constructor(
        private mongoSer: MongoService,
        protected moduleRef: ModuleRef
    ) {
    }

    /** This method has to be called once in the childs onModuleInit method */
    protected async init(modelName: string) {
        this.model = this.mongoSer.getModel(modelName);
    }


    async find(q: any = {}, sort = {}): Promise<any[]> {
        return this.model.find(q).sort(sort);
    }

    async findOne(q: any, populate = []) {
        return this.model.findOne(q).populate(populate);
    }

    async findOneById(id: string, populate = []) {
        return this.model.findOne({ _id: id }).populate(populate);
    }

    async create(data: any) {
        const res = await this.model.create(data);

        return res;
    }

    async update(id: string, data) {
        const res = await this.model.findByIdAndUpdate(id, data, { new: true });

        return res;
    }

    async findOneAndUpdate(q: any, data: any) {
        const res = await this.model.findOne(q, data);

        return this.update(res._id, data);
    }
}
