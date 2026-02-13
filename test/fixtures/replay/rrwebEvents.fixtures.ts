/**
 * Fixture with a representative sample of rrweb events
 * Extracted from real session recordings and categorized by type
 */

import {
  EventType,
  IncrementalSource,
  MouseInteractions,
  NodeType,
  PointerTypes,
} from '@rrweb/types';

/**
 * A collection of unique rrweb events for testing
 * Extracted from real recordings
 */
export const rrwebEvents = {
  fullSnapshot: {
    type: EventType.FullSnapshot,
    data: {
      node: {
        type: NodeType.Document,
        childNodes: [
          {
            type: NodeType.DocumentType,
            name: 'html',
            publicId: '',
            systemId: '',
            id: 2,
          },
          {
            type: NodeType.Element,
            tagName: 'html',
            attributes: { lang: 'en' },
            childNodes: [
              {
                type: NodeType.Element,
                tagName: 'head',
                attributes: {},
                childNodes: [],
                id: 4,
              },
              {
                type: NodeType.Element,
                tagName: 'body',
                attributes: {},
                childNodes: [],
                id: 5,
              },
            ],
            id: 3,
          },
        ],
        id: 1,
      },
      initialOffset: {
        top: 0,
        left: 0,
      },
    },
    timestamp: 1744983335278,
  },

  mouseMove: {
    type: EventType.IncrementalSnapshot,
    data: {
      source: IncrementalSource.MouseMove,
      positions: [
        {
          x: 178,
          y: 327,
          id: 17,
          timeOffset: 0,
        },
        {
          x: 180,
          y: 331,
          id: 17,
          timeOffset: 100,
        },
      ],
    },
    timestamp: 1744983335279,
  },

  mouseInteractionClick: {
    type: EventType.IncrementalSnapshot,
    data: {
      source: IncrementalSource.MouseInteraction,
      type: MouseInteractions.Click,
      id: 17,
      x: 180,
      y: 331,
      pointerType: PointerTypes.Mouse,
    },
    timestamp: 1744983335280,
  },

  mouseInteractionDown: {
    type: EventType.IncrementalSnapshot,
    data: {
      source: IncrementalSource.MouseInteraction,
      type: MouseInteractions.MouseDown,
      id: 17,
      x: 180,
      y: 331,
      pointerType: PointerTypes.Mouse,
    },
    timestamp: 1744983335281,
  },

  mouseInteractionUp: {
    type: EventType.IncrementalSnapshot,
    data: {
      source: IncrementalSource.MouseInteraction,
      type: MouseInteractions.MouseUp,
      id: 17,
      x: 180,
      y: 331,
      pointerType: PointerTypes.Mouse,
    },
    timestamp: 1744983335282,
  },

  scroll: {
    type: EventType.IncrementalSnapshot,
    data: {
      source: IncrementalSource.Scroll,
      id: 1,
      x: 0,
      y: 274,
    },
    timestamp: 1744983335283,
  },

  viewportResize: {
    type: EventType.IncrementalSnapshot,
    data: {
      source: IncrementalSource.ViewportResize,
      width: 1721,
      height: 488,
    },
    timestamp: 1744983335284,
  },

  input: {
    type: EventType.IncrementalSnapshot,
    data: {
      source: IncrementalSource.Input,
      id: 100,
      text: 'user input text',
      isChecked: false,
      userTriggered: true,
    },
    timestamp: 1744983335285,
  },

  mutation: {
    type: EventType.IncrementalSnapshot,
    data: {
      source: IncrementalSource.Mutation,
      texts: [],
      attributes: [
        {
          id: 73,
          attributes: {
            class: 'active',
          },
        },
      ],
      removes: [],
      adds: [
        {
          parentId: 5,
          nextId: null,
          node: {
            type: NodeType.Element,
            tagName: 'div',
            attributes: {
              id: 'new-element',
            },
            childNodes: [],
            id: 101,
          },
        },
      ],
    },
    timestamp: 1744983335286,
  },

  selection: {
    type: EventType.IncrementalSnapshot,
    data: {
      source: IncrementalSource.Selection,
      ranges: [
        {
          start: 20,
          startOffset: 0,
          end: 20,
          endOffset: 4,
        },
      ],
    },
    timestamp: 1744983335287,
  },

  meta: {
    type: EventType.Meta,
    data: {
      href: 'http://localhost:3001/',
      width: 1721,
      height: 470,
    },
    timestamp: 1744983335288,
  },

  custom: {
    type: EventType.Custom,
    data: {
      tag: 'custom-event',
      payload: {
        key: 'value',
      },
    },
    timestamp: 1744983335289,
  },

  plugin: {
    type: EventType.Plugin,
    data: {
      plugin: 'rrweb/console@1',
      payload: {
        level: 'log',
        args: ['Console log message'],
      },
    },
    timestamp: 1744983335290,
  },

  invalid: {
    type: 999,
    data: {},
    timestamp: 1744983335291,
  },

  incomplete: {
    type: EventType.IncrementalSnapshot,
    // Missing data and timestamp
  },
};
