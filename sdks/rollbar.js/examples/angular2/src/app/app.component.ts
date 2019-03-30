import { Component, Inject, NgZone } from '@angular/core';
import { RollbarService } from './rollbar';
import * as Rollbar from 'rollbar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(@Inject(RollbarService) private rollbar: Rollbar, private ngZone: NgZone) {
    // Used by Karma tests
    window['angularAppComponent'] = this;
  }

  rollbarInfo() {
    console.log('rollbarInfo', this);
    this.rollbar.info('angular test log');
  }

  throwError() {
    console.log('throwError', this);
    throw new Error('angular test error');
  }

  // Public functions used by Karma tests
  publicRollbarInfo() {
    this.ngZone.run(() => this.rollbarInfo());
  }

  publicThrowError() {
    this.ngZone.run(() => this.throwError());
  }
}
