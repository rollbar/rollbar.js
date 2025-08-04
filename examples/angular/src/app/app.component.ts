// src/app/app.component.ts
import { Component, inject } from '@angular/core';
import { RollbarService } from './rollbar.errorhandler';
import Rollbar from 'rollbar';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <h1>Rollbar Standalone App</h1>
    <button (click)="throwAnError()">Throw an Error</button>
    <button (click)="logWarning()">Log a Warning</button>
  `,
})
export class AppComponent {
  // Option 1: using Angular’s `inject` function
  private rollbar = inject<Rollbar>(RollbarService);

  throwAnError(): void {
    // This will be caught by our RollbarErrorHandler
    throw new Error('Test error from AppComponent!');
  }

  logWarning(): void {
    // Manually log a warning to Rollbar
    this.rollbar.warning('Test warning from AppComponent');
  }
}
