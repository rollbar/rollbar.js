import { Component, Inject, NgZone } from '@angular/core';
import { RollbarService } from './rollbar';
import * as Rollbar from 'rollbar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(
    @Inject(RollbarService) private rollbar: Rollbar,
    private ngZone: NgZone,
  ) {
    // Used by rollbar.js tests
    window['angularAppComponent'] = this;
  }

  // Example log event using the rollbar object.
  rollbarInfo() {
    this.rollbar.info('angular test log');
  }

  // Example error, which will be reported to rollbar.
  throwError() {
    throw new Error('angular test error');
  }

  // Example log event with undefined arg.
  rollbarInfoWithUndefined() {
    this.rollbar.info('angular test log with undefined', undefined);
  }
  // Methods used by rollbar.js tests

  publicRollbarInfo() {
    this.ngZone.run(() => this.rollbarInfo());
  }

  publicThrowError() {
    this.ngZone.run(() => this.throwError());
  }

  publicRollbarInfoWithUndefined() {
    this.ngZone.run(() => this.rollbarInfoWithUndefined());
  }

  doCheckCount: number = 0;

  // Used to monitor change detection events
  ngDoCheck() {
    this.doCheckCount += 1;
  }
}
