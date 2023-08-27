import * as dotenv from 'dotenv';
dotenv.config();

export abstract class AppConfiguration {

    static get mongoDbUri(): string {
        const db = process.env.MONGO_DB;
        let auth = '';
        let authSource = '';
        if (process.env.MONGO_USER && process.env.MONGO_PASSWORD) {
            auth = `${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@`;
            authSource = 'authSource=admin';
        }

        return `mongodb://${auth}${process.env.MONOG_URL}:${process.env
            .MONGO_PORT || 27017}/${db}?${authSource}`;
    }

    static get applicationPort() {
        return process.env.PORT || 3000;
    }

}