import { RestApiModule } from './rest/rest-api.module';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter/dist/event-emitter.module';

@Module({
  imports: [
    RestApiModule,
    EventEmitterModule.forRoot({ wildcard: true }),
  ],
})
export class AppModule { }
