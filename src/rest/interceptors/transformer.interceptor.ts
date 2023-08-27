import { Reflector } from '@nestjs/core';
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';
import { ClassConstructor, Expose, ExposeOptions, plainToInstance } from 'class-transformer';
import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Injectable, SetMetadata, applyDecorators } from '@nestjs/common/decorators';


interface TransformerConfigInterface {
  transformer: ClassConstructor<any>,
}
export const TransformerConfig = (config: TransformerConfigInterface) => SetMetadata('transformer_config', config);


export function ApiPropertyExposed(apiPropertyOptions: ApiPropertyOptions = {}, requiredPermission: string = null, exposeOpt: ExposeOptions = {}) {
  if (requiredPermission) {
    exposeOpt.groups = [requiredPermission];
    apiPropertyOptions.description = `Required permission: ${requiredPermission}`;
  }

  return applyDecorators(
    ApiProperty(apiPropertyOptions),
    Expose(exposeOpt)
  );
}

@Injectable()
export class TransformerInterceptor implements NestInterceptor {

  private transformerConfig: TransformerConfigInterface;

  constructor(private reflector: Reflector) {
  }

  async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
    const req = context.switchToHttp().getRequest();

    // get the config from either the controller or the specified function
    this.transformerConfig = this.getConfigFromContext(context, true) || this.getConfigFromContext(context);

    return next.handle().pipe(
      map(data => {
        if (!data) return data;

        return this.transform(data, req.params.currentUser?.permissions || []);
      }),
    );
  }

  private getConfigFromContext(context, fromFunction = false): TransformerConfigInterface {
    return this.reflector.get<TransformerConfigInterface>('transformer_config', fromFunction ? context.getHandler() : context.getClass()) || null
  }

  private transform(data: any, permissions = []) {

    // Paginated
    if (Array.isArray(data.data)) {
      data.data = data.data.map(i => this.transformOne(i, permissions));

      return data;
    }

    // when array
    if (Array.isArray(data)) return data.map(e => {
      return this.transformOne(e, permissions);
    });

    return this.transformOne(data, permissions);
  }

  private transformOne(data, permissions) {
    try {
      if (this.transformerConfig) return plainToInstance(this.transformerConfig.transformer, data, {
        excludeExtraneousValues: true,
        groups: permissions,
      });
    } catch (e) {
      Logger.error(`Error in transformer: <${this.transformerConfig.transformer}>: ${e.message}.`)
      return {};
    }

    return data;
  }
}
