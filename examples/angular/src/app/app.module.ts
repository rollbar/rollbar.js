import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';

import { AppComponent } from './app.component';
import { RollbarService, RollbarErrorHandler } from './rollbar.errorhandler';
import { RollbarFactory } from './rollbar.config';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule],
  providers: [
    // Provide the Rollbar instance
    { provide: RollbarService, useFactory: RollbarFactory },

    // Override Angular's default ErrorHandler with our RollbarErrorHandler
    { provide: ErrorHandler, useClass: RollbarErrorHandler },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

