/**
 * Test utilities for accessing Recorder's ring buffer internals.
 */

export const currentBuffer = (r) => r._buffers[r._currentSlot];
export const previousBuffer = (r) => r._buffers[r._previousSlot];

export const setCurrentBuffer = (r, es) => (r._buffers[r._currentSlot] = es);
export const setPreviousBuffer = (r, es) => (r._buffers[r._previousSlot] = es);
