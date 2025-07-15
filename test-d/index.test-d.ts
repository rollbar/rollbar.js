import { expectAssignable, expectError } from 'tsd';
import type { RecorderOptions } from '../index';

expectAssignable<RecorderOptions>({ enabled: true });
expectError<RecorderOptions>({ foo: 'bar' });