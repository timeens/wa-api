import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from "@nestjs/mongoose";
import { WaClientResource, WaClientResourceSchema } from "./schemas/wa-client-resource.schema";
import { MongoService } from "./mongo.service";
import { AppConfiguration } from 'src/app-configuration';

function getMongoUrl(): string {
  const uri = AppConfiguration.mongoDbUri;
  new Logger().log(`Connecting to: ${uri}`);
  return uri;
}

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [],
      useFactory: async () => ({
        uri: getMongoUrl(),
        connectionFactory: (connection) => {
          connection.plugin(require('mongoose-autopopulate'));

          return connection;
        }
      }),
      inject: [],
    }),
    MongooseModule.forFeature([
      { name: WaClientResource.name, schema: WaClientResourceSchema },
    ]),
  ],
  providers: [MongoService],
  exports: [MongoService]
})
export class MongoResourceModule { }
