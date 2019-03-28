import { Component, Inject } from '@angular/core';
import { RollbarService } from './rollbar';
import * as Rollbar from 'rollbar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(@Inject(RollbarService) rollbar: Rollbar) {
    this.rollbar = rollbar;
  }

  private rollbar: Rollbar;

  title = 'my-app';

  rollbarInfo() {
    console.log('rollbarInfo', this);
    this.rollbar.info('angular test log');
  }

  throwError() {
    console.log('throwError', this);
    throw new Error('angular test error');
  }
}
