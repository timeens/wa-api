import { MongoResourceModule } from 'src/lib/mongo/mongo-resource.module';
import { TransformerInterceptor } from './interceptors/transformer.interceptor';
import { UrlParamItemExistsInterceptor } from './interceptors/url-param-item-exists.interceptor';
import { ClientEndpointModule } from './wa-client/wa-client-endpoint.module';
import { Module, ValidationPipe } from "@nestjs/common";
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

const ENDPOINT_MODULES = [
    ClientEndpointModule
]

@Module({
    imports: [
        MongoResourceModule,
        ...ENDPOINT_MODULES,
    ],
    providers: [
        // global interceptors
        {
            provide: APP_INTERCEPTOR,
            useClass: UrlParamItemExistsInterceptor,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: TransformerInterceptor,
        },
        {
            provide: APP_PIPE,
            useFactory: () => {
                return new ValidationPipe({ whitelist: true });
            }

        }
    ]
})
export class RestApiModule { }
