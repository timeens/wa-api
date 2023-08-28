import { Reflector } from '@nestjs/core';
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, SetMetadata, Logger, NotFoundException } from '@nestjs/common';
import { MongoService } from 'src/lib/mongo/mongo.service';
import * as mongoose from 'mongoose';

interface UrlParamsValidationConfigInterface {
  param: string;
  resource?: string,
  existsInDb?: boolean;
  validate?: (model) => boolean
}

export const UrlParamValidationConfig = (config: UrlParamsValidationConfigInterface[]) => SetMetadata('url_param_validation', config);

@Injectable()
export class UrlParamItemExistsInterceptor implements NestInterceptor {

  constructor(private reflector: Reflector, private readonly mondoSer: MongoService) { }

  async intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
    // get the config from either the controller or the specified function
    const urlParamValidationConfigs = this.getConfigFromContext(context) || this.getConfigFromContext(context, true);
    const req = context.switchToHttp().getRequest();

    if (urlParamValidationConfigs && urlParamValidationConfigs.length !== 0) {
      for (let c of urlParamValidationConfigs) {
        const value = req.params[c.param] || null;
        if (value) await this.validateUrlParam(c, value);
      }
    } else {
      const notValidatedUrlParams = Object.keys(req.params).filter(key => key !== 'currentUser')
      if (notValidatedUrlParams.length !== 0) {
        for (let nvu of notValidatedUrlParams) {
          Logger.warn(`Unvalidated url param detected: <${nvu}> in controller: <${context.getClass().name}> => function: <${context.getHandler().name}>`);
        }
      }
    }

    return next.handle();
  }

  private getConfigFromContext(context, fromFunction = false): UrlParamsValidationConfigInterface[] {
    return this.reflector.get<UrlParamsValidationConfigInterface[]>('url_param_validation', fromFunction ? context.getHandler() : context.getClass()) || null
  }

  private async validateUrlParam(config: UrlParamsValidationConfigInterface, value) {
    if (config.validate) {
      if (!config.resource) Logger.error(`Resource missing in URL param validation`);
      const m = this.mondoSer.getModel(config.resource);
      if (!config.validate(await m.findById(value))) throw new NotFoundException();
    }
    if (config.existsInDb) {
      if (!config.resource) Logger.error(`Resource missing in URL param validation`);
      if (!mongoose.isValidObjectId(value)) throw new NotFoundException();
      const m = this.mondoSer.getModel(config.resource);
      const exists = await m.findById(value);
      if (!exists) throw new NotFoundException();
    }
  }
}
