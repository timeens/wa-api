import { SWAGGER_TAGS } from './swagger-tags';
import { SwaggerModule } from '@nestjs/swagger/dist';
import { DocumentBuilder } from '@nestjs/swagger';

export function initSwaggerDoc(nestApp: any, endpoint = 'api') {
    const builder = new DocumentBuilder();
    builder
        .setTitle(`Whatsapp API`)
        .addBearerAuth()

    for (let t of SWAGGER_TAGS) {
        builder.addTag(t.name, t.description);
    }

    const document = SwaggerModule.createDocument(nestApp, builder.build());

    SwaggerModule.setup(endpoint, nestApp, document, { jsonDocumentUrl: `${endpoint}-json` });
}