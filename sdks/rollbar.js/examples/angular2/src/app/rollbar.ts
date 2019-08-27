import * as Rollbar from 'rollbar';
import {
  Injectable,
  Inject,
  InjectionToken,
  ErrorHandler
} from '@angular/core';

const rollbarConfig:Rollbar.Configuration = {
  accessToken: 'POST_CLIENT_ITEM_TOKEN',
  captureUncaught: true,
  captureUnhandledRejections: true,
  nodeSourceMaps: false,
  inspectAnonymousErrors: true,
  ignoreDuplicateErrors: true,
  wrapGlobalEventHandlers: false,
  scrubRequestBody: true
};

export const RollbarService = new InjectionToken<Rollbar>('rollbar');

@Injectable()
export class RollbarErrorHandler implements ErrorHandler {
  constructor(@Inject(RollbarService) private rollbar: Rollbar) {}

  handleError(err:any) : void {
    this.rollbar.error(err.originalError || err);
  }
}

export function rollbarFactory() {
  return new Rollbar(rollbarConfig);
}
