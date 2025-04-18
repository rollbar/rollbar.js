/**
 * Export all rrweb fixture events in a single module
 */

const types = require('./types');
const realEvents = require('./rrwebEvents.fixtures');
const syntheticEvents = require('./rrwebSyntheticEvents.fixtures');

module.exports = {
  EventType: types.EventType,
  IncrementalSource: types.IncrementalSource,
  MouseInteractions: types.MouseInteractions,
  MediaInteractions: types.MediaInteractions,
  NodeType: types.NodeType,
  PointerTypes: types.PointerTypes,

  // Event collections
  realEvents: realEvents.rrwebEvents,
  syntheticEvents: syntheticEvents.syntheticEvents,
  allEvents: {
    ...realEvents.rrwebEvents,
    ...syntheticEvents.syntheticEvents,
  },
};
