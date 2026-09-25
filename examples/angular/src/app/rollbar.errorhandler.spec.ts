import { TestBed } from '@angular/core/testing';
import type Rollbar from 'rollbar';

import { RollbarErrorHandler } from './rollbar.errorhandler';
import { RollbarService } from './rollbar.service';

describe('RollbarErrorHandler', () => {
  let load: ReturnType<typeof vi.fn>;
  let rollbar: { error: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    rollbar = { error: vi.fn() };
    load = vi.fn(() => Promise.resolve(rollbar as unknown as Rollbar));
    vi.spyOn(console, 'error').mockImplementation(() => {});

    TestBed.configureTestingModule({
      providers: [
        RollbarErrorHandler,
        { provide: RollbarService, useValue: { load } },
      ],
    });
  });

  afterEach(() => vi.restoreAllMocks());

  it('should log the error to the console and report it to Rollbar', async () => {
    const error = new Error('boom');

    TestBed.inject(RollbarErrorHandler).handleError(error);
    await load.mock.results[0].value;

    expect(console.error).toHaveBeenCalledWith(error);
    expect(rollbar.error).toHaveBeenCalledWith(error);
  });

  it('should not throw when Rollbar is unavailable', async () => {
    load.mockResolvedValue(null);

    expect(() =>
      TestBed.inject(RollbarErrorHandler).handleError(new Error('boom')),
    ).not.toThrow();
    await load.mock.results[0].value;
  });
});
