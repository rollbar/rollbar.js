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

export default class Recorder {
  constructor(options: Record<string, any>);

  get isRecording(): boolean;
  get isReady(): boolean;
  get options(): Record<string, any>;
  set options(newOptions: Record<string, any>);

  configure(newOptions: Record<string, any>): void;
  checkoutEveryNms(): number;
  bufferCursor(): BufferCursor;
  exportRecordingSpan(
    tracing: any,
    attributes?: Record<string, any>,
    cursor?: BufferCursor,
  ): void;
  start(): this;
  stop(): this;
  clear(): void;
}
