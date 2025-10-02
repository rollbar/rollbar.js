import type { Rollbar } from '../../../index.js';

/** A point-in-time cursor into the active Recorder's two-slot ring buffer. */
export type BufferCursor = {
  /** Index (0|1) of the active buffer's slot at snapshot time. */
  slot: 0 | 1;
  /**
   * Zero-based index of the last event at snapshot time; exclusive boundary.
   * May be -1 when empty.
   */
  offset: number;
};

export interface Recorder extends Rollbar.RecorderType {
  bufferCursor(): BufferCursor;
  exportRecordingSpan(
    tracing: any,
    attributes?: Record<string, any>,
    cursor?: BufferCursor,
  ): void;
}

declare const Recorder: Recorder;

export default Recorder;
