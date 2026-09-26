import { TestBed } from '@angular/core/testing';
import type Rollbar from 'rollbar';

import { AppComponent } from './app.component';
import { RollbarService } from './rollbar.service';

describe('AppComponent', () => {
  let rollbar: { warning: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    rollbar = { warning: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        {
          provide: RollbarService,
          useValue: { load: () => Promise.resolve(rollbar as unknown as Rollbar) },
        },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the title', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain(
      'Rollbar Standalone App',
    );
  });

  it('should log a warning to Rollbar', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    await fixture.componentInstance.logWarning();
    await fixture.whenStable();
    expect(rollbar.warning).toHaveBeenCalledWith(
      'Test warning from AppComponent',
    );
  });
});
