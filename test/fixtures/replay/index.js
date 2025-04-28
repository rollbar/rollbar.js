/**
 * Export all rrweb fixture events in a single module
 */

import { rrwebEvents } from './rrwebEvents.fixtures.js';
import { syntheticEvents } from './rrwebSyntheticEvents.fixtures.js';

// Event collections
export const realEvents = rrwebEvents;
export const allEvents = {
  ...rrwebEvents,
  ...syntheticEvents,
};
