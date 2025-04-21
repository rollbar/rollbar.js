/**
 * Export all rrweb fixture events in a single module
 */

import * as types from './types.js';
import { rrwebEvents } from './rrwebEvents.fixtures.js';
import { syntheticEvents } from './rrwebSyntheticEvents.fixtures.js';

export const EventType = types.EventType;
export const IncrementalSource = types.IncrementalSource;
export const MouseInteractions = types.MouseInteractions;
export const MediaInteractions = types.MediaInteractions;
export const NodeType = types.NodeType;
export const PointerTypes = types.PointerTypes;

// Event collections
export const realEvents = rrwebEvents;
export const allEvents = {
  ...rrwebEvents,
  ...syntheticEvents,
};
