/**
 * Fixtures for OTLP-formatted payloads used in tests
 */
import { EventType } from '@rrweb/types';

/**
 * Standard payload with one event of each type (Meta and FullSnapshot)
 */
export const standardPayload = {
  resourceSpans: [
    {
      resource: { attributes: [] },
      scopeSpans: [
        {
          scope: { name: 'rollbar.js', version: '1.0.0', attributes: [] },
          spans: [
            {
              name: 'rrweb-replay-recording',
              traceId: 'abcdef1234567890abcdef1234567890',
              spanId: '1234567890abcdef',
              parentSpanId: '',
              kind: 1,
              startTimeUnixNano: '1600000000000000000',
              endTimeUnixNano: '1600000100000000000',
              attributes: [
                {
                  key: 'rollbar.replay.id',
                  value: { stringValue: 'test-replay-id' },
                },
              ],
              events: [
                {
                  name: 'rrweb-replay-events',
                  timeUnixNano: '1600000050000000000',
                  attributes: [
                    {
                      key: 'eventType',
                      value: { stringValue: String(EventType.Meta) },
                    },
                    { key: 'json', value: { stringValue: '{}' } },
                  ],
                },
                {
                  name: 'rrweb-replay-events',
                  timeUnixNano: '1600000060000000000',
                  attributes: [
                    {
                      key: 'eventType',
                      value: { stringValue: String(EventType.FullSnapshot) },
                    },
                    { key: 'json', value: { stringValue: '{}' } },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

/**
 * Checkpoint payload with multiple Meta and FullSnapshot events
 * representing checkpoints in the recording
 */
export const checkpointPayload = {
  resourceSpans: [
    {
      resource: { attributes: [] },
      scopeSpans: [
        {
          scope: { name: 'rollbar.js', version: '1.0.0', attributes: [] },
          spans: [
            {
              name: 'rrweb-replay-recording',
              traceId: 'abcdef1234567890abcdef1234567890',
              spanId: '1234567890abcdef',
              parentSpanId: '',
              kind: 1,
              startTimeUnixNano: '1600000000000000000',
              endTimeUnixNano: '1600000400000000000',
              attributes: [
                {
                  key: 'rollbar.replay.id',
                  value: { stringValue: 'test-replay-id' },
                },
              ],
              events: [
                {
                  name: 'rrweb-replay-events',
                  timeUnixNano: '1600000050000000000',
                  attributes: [
                    {
                      key: 'eventType',
                      value: { stringValue: String(EventType.Meta) },
                    },
                    { key: 'json', value: { stringValue: '{}' } },
                  ],
                },
                {
                  name: 'rrweb-replay-events',
                  timeUnixNano: '1600000060000000000',
                  attributes: [
                    {
                      key: 'eventType',
                      value: { stringValue: String(EventType.FullSnapshot) },
                    },
                    { key: 'json', value: { stringValue: '{}' } },
                  ],
                },
                {
                  name: 'rrweb-replay-events',
                  timeUnixNano: '1600000250000000000',
                  attributes: [
                    {
                      key: 'eventType',
                      value: { stringValue: String(EventType.Meta) },
                    },
                    { key: 'json', value: { stringValue: '{}' } },
                  ],
                },
                {
                  name: 'rrweb-replay-events',
                  timeUnixNano: '1600000260000000000',
                  attributes: [
                    {
                      key: 'eventType',
                      value: { stringValue: String(EventType.FullSnapshot) },
                    },
                    { key: 'json', value: { stringValue: '{}' } },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

/**
 * Single checkpoint payload with just one set of Meta and FullSnapshot events
 */
export const singleCheckpointPayload = {
  resourceSpans: [
    {
      resource: { attributes: [] },
      scopeSpans: [
        {
          scope: { name: 'rollbar.js', version: '1.0.0', attributes: [] },
          spans: [
            {
              name: 'rrweb-replay-recording',
              traceId: 'abcdef1234567890abcdef1234567890',
              spanId: '1234567890abcdef',
              parentSpanId: '',
              kind: 1,
              startTimeUnixNano: '1600000000000000000',
              endTimeUnixNano: '1600000100000000000',
              attributes: [
                {
                  key: 'rollbar.replay.id',
                  value: { stringValue: 'test-replay-id' },
                },
              ],
              events: [
                {
                  name: 'rrweb-replay-events',
                  timeUnixNano: '1600000050000000000',
                  attributes: [
                    {
                      key: 'eventType',
                      value: { stringValue: String(EventType.Meta) },
                    },
                    { key: 'json', value: { stringValue: '{}' } },
                  ],
                },
                {
                  name: 'rrweb-replay-events',
                  timeUnixNano: '1600000060000000000',
                  attributes: [
                    {
                      key: 'eventType',
                      value: { stringValue: String(EventType.FullSnapshot) },
                    },
                    { key: 'json', value: { stringValue: '{}' } },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

/**
 * Creates a deep clone of the standardPayload and updates the replay ID
 * @param {string} replayId - The replay ID to set in the payload
 * @returns {Object} A new payload object with the specified replay ID
 */
export function createPayloadWithReplayId(replayId) {
  const payload = JSON.parse(JSON.stringify(standardPayload));

  const idAttr =
    payload.resourceSpans[0].scopeSpans[0].spans[0].attributes.find(
      (attr) => attr.key === 'rollbar.replay.id',
    );

  if (idAttr) {
    idAttr.value.stringValue = replayId;
  }

  return payload;
}
