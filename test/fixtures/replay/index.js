/**
 * Export all rrweb fixture events and payloads in a single module
 */

import { rrwebEvents } from './rrwebEvents.fixtures.js';
import { syntheticEvents } from './rrwebSyntheticEvents.fixtures.js';
import * as payloads from './payloads.fixtures.js';

// Event collections
export const realEvents = rrwebEvents;
export const allEvents = {
  ...rrwebEvents,
  ...syntheticEvents,
};

// Payload fixtures
export const standardPayload = payloads.standardPayload;
export const checkpointPayload = payloads.checkpointPayload;
export const singleCheckpointPayload = payloads.singleCheckpointPayload;
export const createPayloadWithReplayId = payloads.createPayloadWithReplayId;
