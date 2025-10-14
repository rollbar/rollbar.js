import type { Rollbar } from '../../../index.js';
import type Recorder from './recorder.js';

export class Replay extends Rollbar.ReplayType {
  constructor(props: {
    tracing: any;
    telemeter?: any;
    options: Record<string, any>;
  });

  configure(options: Record<string, any>): void;

  capture(
    replayId: string,
    occurrenceUuid: string,
    triggerContext: any,
  ): string | null;

  triggerReplay(triggerContext: any): Promise<string | null>;

  send(replayId: string): Promise<void>;

  discard(replayId: string): boolean;

  sendOrDiscardReplay(
    replayId: string,
    err: any,
    resp: any,
    headers: Record<string, string>,
  ): Promise<void>;

  getSpans(replayId: string): any[] | null;

  setSpans(replayId: string, spans: any[]): void;

  clear(): void;

  get recorder(): Recorder;

  get size(): number;
}

declare const Replay: Replay;

export default Replay;
