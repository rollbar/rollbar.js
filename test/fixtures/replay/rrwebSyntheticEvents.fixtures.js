/**
 * Synthetic rrweb events created from type definitions
 * These events are NOT from real recordings but are created based on the
 * type definitions in @rrweb/types to ensure complete test coverage.
 */

import {
  EventType,
  IncrementalSource,
  MouseInteractions,
  MediaInteractions,
  NodeType,
  PointerTypes,
} from './types.js';

/**
 * Synthetic events created from type definitions for testing
 * These cover sources and interactions not in the real recordings
 */
const syntheticEvents = {
  domContentLoaded: {
    type: EventType.DomContentLoaded,
    data: {}, // Empty object confirmed in rrweb/src/record/index.ts
    timestamp: 1744983335276,
  },

  load: {
    type: EventType.Load,
    data: {}, // Empty object confirmed in rrweb/src/record/index.ts
    timestamp: 1744983335277,
  },

  touchMove: {
    type: EventType.IncrementalSnapshot,
    data: {
      source: IncrementalSource.TouchMove,
      positions: [
        {
          x: 150,
          y: 200,
          id: 20,
          timeOffset: 0,
        },
        {
          x: 160,
          y: 210,
          id: 20,
          timeOffset: 100,
        },
      ],
    },
    timestamp: 1744983335300,
  },

  mediaInteractionPlay: {
    type: EventType.IncrementalSnapshot,
    data: {
      source: IncrementalSource.MediaInteraction,
      type: MediaInteractions.Play,
      id: 45,
      currentTime: 0,
    },
    timestamp: 1744983335310,
  },

  mediaInteractionPause: {
    type: EventType.IncrementalSnapshot,
    data: {
      source: IncrementalSource.MediaInteraction,
      type: MediaInteractions.Pause,
      id: 45,
      currentTime: 30.5,
    },
    timestamp: 1744983335320,
  },

  mediaInteractionSeeked: {
    type: EventType.IncrementalSnapshot,
    data: {
      source: IncrementalSource.MediaInteraction,
      type: MediaInteractions.Seeked,
      id: 45,
      currentTime: 60,
    },
    timestamp: 1744983335330,
  },

  mediaInteractionVolumeChange: {
    type: EventType.IncrementalSnapshot,
    data: {
      source: IncrementalSource.MediaInteraction,
      type: MediaInteractions.VolumeChange,
      id: 45,
      volume: 0.75,
      muted: false,
    },
    timestamp: 1744983335340,
  },

  mediaInteractionRateChange: {
    type: EventType.IncrementalSnapshot,
    data: {
      source: IncrementalSource.MediaInteraction,
      type: MediaInteractions.RateChange,
      id: 45,
      playbackRate: 1.5,
    },
    timestamp: 1744983335350,
  },

  styleSheetRule: {
    type: EventType.IncrementalSnapshot,
    data: {
      source: IncrementalSource.StyleSheetRule,
      styleId: 3,
      adds: [
        {
          rule: '.new-class { color: red; }',
          index: 1,
        },
      ],
    },
    timestamp: 1744983335360,
  },

  canvasMutation: {
    type: EventType.IncrementalSnapshot,
    data: {
      source: IncrementalSource.CanvasMutation,
      id: 24,
      type: 0, // 2D canvas mutation
      commands: [
        {
          property: 'fillStyle',
          args: ['#ff0000'],
          setter: true,
        },
        {
          property: 'fillRect',
          args: [10, 10, 100, 100],
          setter: false,
        },
      ],
    },
    timestamp: 1744983335370,
  },

  font: {
    type: EventType.IncrementalSnapshot,
    data: {
      source: IncrementalSource.Font,
      family: 'CustomFont',
      fontSource: "url('path/to/font.woff2')",
      buffer: false,
      descriptors: {
        style: 'normal',
        weight: '400',
        display: 'swap',
      },
    },
    timestamp: 1744983335380,
  },

  log: {
    type: EventType.IncrementalSnapshot,
    data: {
      source: IncrementalSource.Log,
      level: 'info',
      trace: [],
      payload: ['Log message from application'],
    },
    timestamp: 1744983335390,
  },

  drag: {
    type: EventType.IncrementalSnapshot,
    data: {
      source: IncrementalSource.Drag,
      positions: [
        {
          x: 100,
          y: 100,
          id: 50,
          timeOffset: 0,
        },
        {
          x: 120,
          y: 120,
          id: 50,
          timeOffset: 100,
        },
        {
          x: 140,
          y: 140,
          id: 50,
          timeOffset: 200,
        },
      ],
    },
    timestamp: 1744983335400,
  },

  styleDeclaration: {
    type: EventType.IncrementalSnapshot,
    data: {
      source: IncrementalSource.StyleDeclaration,
      id: 64,
      index: [0],
      set: {
        property: 'color',
        value: 'blue',
        priority: 'important',
      },
    },
    timestamp: 1744983335410,
  },

  adoptedStyleSheet: {
    type: EventType.IncrementalSnapshot,
    data: {
      source: IncrementalSource.AdoptedStyleSheet,
      id: 1,
      styles: [
        {
          id: 1,
          rules: [
            {
              cssText: 'body { margin: 0; padding: 0; }',
            },
            {
              cssText: 'h1 { font-size: 24px; }',
            },
          ],
        },
      ],
    },
    timestamp: 1744983335420,
  },

  customElement: {
    type: EventType.IncrementalSnapshot,
    data: {
      source: IncrementalSource.CustomElement,
      id: 80,
      mutations: [
        {
          type: 'attributes',
          name: 'data-custom',
          value: 'new-value',
        },
      ],
    },
    timestamp: 1744983335430,
  },

  mouseInteractionDblClick: {
    type: EventType.IncrementalSnapshot,
    data: {
      source: IncrementalSource.MouseInteraction,
      type: MouseInteractions.DblClick,
      id: 73,
      x: 200,
      y: 300,
      pointerType: PointerTypes.Mouse,
    },
    timestamp: 1744983335440,
  },

  mouseInteractionContextMenu: {
    type: EventType.IncrementalSnapshot,
    data: {
      source: IncrementalSource.MouseInteraction,
      type: MouseInteractions.ContextMenu,
      id: 73,
      x: 200,
      y: 300,
      pointerType: PointerTypes.Mouse,
    },
    timestamp: 1744983335450,
  },

  mouseInteractionFocus: {
    type: EventType.IncrementalSnapshot,
    data: {
      source: IncrementalSource.MouseInteraction,
      type: MouseInteractions.Focus,
      id: 73,
      pointerType: PointerTypes.Mouse,
    },
    timestamp: 1744983335460,
  },

  mouseInteractionBlur: {
    type: EventType.IncrementalSnapshot,
    data: {
      source: IncrementalSource.MouseInteraction,
      type: MouseInteractions.Blur,
      id: 73,
      pointerType: PointerTypes.Mouse,
    },
    timestamp: 1744983335470,
  },

  mouseInteractionTouchStart: {
    type: EventType.IncrementalSnapshot,
    data: {
      source: IncrementalSource.MouseInteraction,
      type: MouseInteractions.TouchStart,
      id: 73,
      x: 200,
      y: 300,
      pointerType: PointerTypes.Touch,
    },
    timestamp: 1744983335480,
  },

  mouseInteractionTouchEnd: {
    type: EventType.IncrementalSnapshot,
    data: {
      source: IncrementalSource.MouseInteraction,
      type: MouseInteractions.TouchEnd,
      id: 73,
      x: 200,
      y: 300,
      pointerType: PointerTypes.Touch,
    },
    timestamp: 1744983335490,
  },
};

export { syntheticEvents };
