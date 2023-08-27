import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Allow } from 'class-validator';
import { Observable } from 'rxjs';


/**
 * Attaches < urlParam > and < currentUserId > to the body of the request for advanced custom validation:
 * Using global intercepter ContextInterceport
 */
export abstract class AllowContextInBodyDto {
  @Allow()
  context: {
    urlParams: any,
    currentUserId: any,
  }
}

/**
 * Injects request data into the context, so that the ValidationPipe can use it.
 */
@Injectable()
export class ContextInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    const params = { ...request.params }; // clone the object
    delete params.currentUser; // make sure the current user is not injected (conflicts with validation pipe)

    request.body.context = {
      urlParams: params,
      currentUserId: request.params.currentUser?.id || null,
      // query: request.query // not needed atm
    };

    return next.handle();
  }
}
