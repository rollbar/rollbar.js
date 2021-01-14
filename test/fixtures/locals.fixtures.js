'use strict';

var localsFixtures = {
  maps: {
    // simple map includes only the local scope and a single stack frame.
    simple: {
      callFrames: [
        { callFrameId: '{"ordinal":0,"injectedScriptId":1}',
          functionName: '',
          functionLocation: { scriptId: '121', lineNumber: 24, columnNumber: 12 },
          location: { scriptId: '121', lineNumber: 28, columnNumber: 16 },
          url: 'file:///example/test/locals1.js',
          scopeChain: [
            { type: 'local',
              object: {
                type: 'object',
                className: 'Object',
                description: 'Object',
                objectId: 'objectId1' // Used to query locals from getProperties
              },
              name: 'nodeThrowNested',
              startLocation: { scriptId: '121', lineNumber: 40, columnNumber: 30 },
              endLocation: { scriptId: '121', lineNumber: 57, columnNumber: 1 }
            }
          ]
        }
      ],
      reason: 'exception',
      data: {
        type: 'object',
        subtype: 'error',
        className: 'Error',
        description: 'Error: node error',
        objectId: '{"injectedScriptId":1,"id":1}',
        uncaught: true
      },
      hitBreakpoints: []
    },
    // complex map includes multiple scopes and multiple stack frames.
    complex: {
      callFrames: [
        { callFrameId: '{"ordinal":0,"injectedScriptId":1}',
          functionName: '',
          functionLocation: { scriptId: '121', lineNumber: 24, columnNumber: 12 },
          location: { scriptId: '121', lineNumber: 28, columnNumber: 16 },
          url: '/example/test/locals2.js',
          scopeChain: [
            { type: 'global',
              object: {
                type: 'object',
                className: 'global',
                description: 'global',
                objectId: '{"injectedScriptId":1,"id":41}'
              }
            },
            { type: 'local',
              object: {
                type: 'object',
                className: 'Object',
                description: 'Object',
                objectId: 'objectId1' // Used to query locals from getProperties
              },
              name: 'nodeThrowNested',
              startLocation: { scriptId: '121', lineNumber: 40, columnNumber: 30 },
              endLocation: { scriptId: '121', lineNumber: 57, columnNumber: 1 }
            },
            { type: 'closure',
              object: {
                type: 'object',
                className: 'Object',
                description: 'Object',
                objectId: '{"injectedScriptId":1,"id":44}'
              },
              startLocation: { scriptId: '121', lineNumber: 0, columnNumber: 0 },
              endLocation: { scriptId: '121', lineNumber: 219, columnNumber: 34 }
            },
          ]
        },
        { callFrameId: '{"ordinal":0,"injectedScriptId":1}',
          functionName: '',
          // functionLocation should not be used for matching. Set to a non-matching value.
          functionLocation: { scriptId: '121', lineNumber: 136, columnNumber: 1 },
          location: { scriptId: '121', lineNumber: 139, columnNumber: 14 },
          url: 'file:///example/test/locals3.js', // The `file://` prefix may be present.
          scopeChain: [
            { type: 'global',
              object: {
                type: 'object',
                className: 'global',
                description: 'global',
                objectId: '{"injectedScriptId":1,"id":41}'
              }
            },
            { type: 'local',
              object: {
                type: 'object',
                className: 'Object',
                description: 'Object',
                objectId: 'objectId2' // Used to query locals from getProperties
              },
              name: 'nodeThrowNested',
              startLocation: { scriptId: '121', lineNumber: 40, columnNumber: 30 },
              endLocation: { scriptId: '121', lineNumber: 57, columnNumber: 1 }
            },
            { type: 'closure',
              object: {
                type: 'object',
                className: 'Object',
                description: 'Object',
                objectId: '{"injectedScriptId":1,"id":44}'
              },
              startLocation: { scriptId: '121', lineNumber: 0, columnNumber: 0 },
              endLocation: { scriptId: '121', lineNumber: 219, columnNumber: 34 }
            },
          ]
        },
        { callFrameId: '{"ordinal":0,"injectedScriptId":1}',
          functionName: '',
          functionLocation: { scriptId: '121', lineNumber: 128, columnNumber: 1 },
          location: { scriptId: '121', lineNumber: 132, columnNumber: 34 },
          url: 'file:///example/test/locals4.js',
          scopeChain: [
            { type: 'global',
              object: {
                type: 'object',
                className: 'global',
                description: 'global',
                objectId: '{"injectedScriptId":1,"id":41}'
              }
            },
            { type: 'local',
              object: {
                type: 'object',
                className: 'Object',
                description: 'Object',
                objectId: 'objectId3' // Used to query locals from getProperties
              },
              name: 'nodeThrowNested',
              startLocation: { scriptId: '121', lineNumber: 40, columnNumber: 30 },
              endLocation: { scriptId: '121', lineNumber: 57, columnNumber: 1 }
            },
            { type: 'closure',
              object: {
                type: 'object',
                className: 'Object',
                description: 'Object',
                objectId: '{"injectedScriptId":1,"id":44}'
              },
              startLocation: { scriptId: '121', lineNumber: 0, columnNumber: 0 },
              endLocation: { scriptId: '121', lineNumber: 219, columnNumber: 34 }
            },
          ]
        }
      ],
      reason: 'exception',
      data: {
        type: 'object',
        subtype: 'error',
        className: 'Error',
        description: 'Error: node error',
        objectId: '{"injectedScriptId":1,"id":1}',
        uncaught: true
      },
      hitBreakpoints: []
    },
    noLocalScope: {
      callFrames: [
        { callFrameId: '{"ordinal":0,"injectedScriptId":1}',
          functionName: '',
          functionLocation: { scriptId: '121', lineNumber: 24, columnNumber: 12 },
          location: { scriptId: '121', lineNumber: 28, columnNumber: 16 },
          url: '/example/test/locals2.js',
          scopeChain: [
            { type: 'global',
              object: {
                type: 'object',
                className: 'global',
                description: 'global',
                objectId: '{"injectedScriptId":1,"id":41}'
              }
            },
            { type: 'closure',
              object: {
                type: 'object',
                className: 'Object',
                description: 'Object',
                objectId: '{"injectedScriptId":1,"id":44}'
              },
              startLocation: { scriptId: '121', lineNumber: 0, columnNumber: 0 },
              endLocation: { scriptId: '121', lineNumber: 219, columnNumber: 34 }
            },
          ]
        },
        { callFrameId: '{"ordinal":0,"injectedScriptId":1}',
          functionName: '',
          // functionLocation should not be used for matching. Set to a non-matching value.
          functionLocation: { scriptId: '121', lineNumber: 136, columnNumber: 1 },
          location: { scriptId: '121', lineNumber: 139, columnNumber: 14 },
          url: 'file:///example/test/locals3.js', // The `file://` prefix may be present.
          scopeChain: [
            { type: 'global',
              object: {
                type: 'object',
                className: 'global',
                description: 'global',
                objectId: '{"injectedScriptId":1,"id":41}'
              }
            },
            { type: 'closure',
              object: {
                type: 'object',
                className: 'Object',
                description: 'Object',
                objectId: '{"injectedScriptId":1,"id":44}'
              },
              startLocation: { scriptId: '121', lineNumber: 0, columnNumber: 0 },
              endLocation: { scriptId: '121', lineNumber: 219, columnNumber: 34 }
            },
          ]
        },
        { callFrameId: '{"ordinal":0,"injectedScriptId":1}',
          functionName: '',
          functionLocation: { scriptId: '121', lineNumber: 128, columnNumber: 1 },
          location: { scriptId: '121', lineNumber: 132, columnNumber: 34 },
          url: 'file:///example/test/locals4.js',
          scopeChain: [
            { type: 'global',
              object: {
                type: 'object',
                className: 'global',
                description: 'global',
                objectId: '{"injectedScriptId":1,"id":41}'
              }
            },
            { type: 'closure',
              object: {
                type: 'object',
                className: 'Object',
                description: 'Object',
                objectId: '{"injectedScriptId":1,"id":44}'
              },
              startLocation: { scriptId: '121', lineNumber: 0, columnNumber: 0 },
              endLocation: { scriptId: '121', lineNumber: 219, columnNumber: 34 }
            },
          ]
        }
      ],
      reason: 'exception',
      data: {
        type: 'object',
        subtype: 'error',
        className: 'Error',
        description: 'Error: node error',
        objectId: '{"injectedScriptId":1,"id":1}',
        uncaught: true
      },
      hitBreakpoints: []
    }
  },

  stacks: {
    simple: [
      { method: 'Timeout._onTimeout',
        filename: '/example/test/locals1.js',
        lineno: 29,
        colno: 16,
        runtimePosition: {
          source: '/example/test/locals1.js',
          line: 29,
          column: 16
        }
      }
    ],
    // The stack order presented by Rollbar.js is reversed.
    complex: [
      { method: 'Method1',
        filename: '/example/test/locals4.js',
        lineno: 133,
        colno: 34,
        runtimePosition: {
          source: '/example/test/locals4.js',
          line: 133,
          column: 34
        }
      },
      { method: 'Method2',
        filename: '/example/test/locals3.ts',
        lineno: 120,
        colno: 40,
        // Runtime location is transpiled, with different filename and location
        runtimePosition: {
          source: '/example/test/locals3.js',
          line: 140,
          column: 14
        }
      },
      { method: 'Method3',
        filename: '/example/test/locals2.js',
        lineno: 13,
        colno: 26,
        runtimePosition: {
          source: '/example/test/locals2.js',
          line: 13,
          column: 26
        }
      }
    ]
  },

  locals: {
    object1: {
      name: 'foo',
      value: {
        type: 'object',
        className: 'FooClass',
        description: 'FooClass',
        objectId: 'nestedProps1'
      },
      writable: true,
      configurable: true,
      enumerable: true,
      isOwn: true
    },
    object2: {
      name: 'bar',
      value: {
        type: 'object',
        className: 'BarClass',
        description: 'BarClass',
        objectId: 'nestedProps2'
      },
      writable: true,
      configurable: true,
      enumerable: true,
      isOwn: true
    },
    boolean1: {
      name: 'old',
      value: {
        type: 'boolean',
        value: false
      },
      writable: true,
      configurable: true,
      enumerable: true,
      isOwn: true
    },
    boolean2: {
      name: 'new',
      value: {
        type: 'boolean',
        value: true
      },
      writable: true,
      configurable: true,
      enumerable: true,
      isOwn: true
    },
    string1: {
      name: 'response',
      value: {
        type: 'string',
        value: 'success'
      },
      writable: true,
      configurable: true,
      enumerable: true,
      isOwn: true
    },
    array1: {
      name: 'args',
      value: {
        type: 'object',
        subtype: 'array',
        className: 'Array',
        description: 'Array(1)',
        objectId: '{"injectedScriptId":1,"id":54}'
      },
      writable: true,
      configurable: true,
      enumerable: true,
      isOwn: true
    },
    function1: {
      name: 'func',
      value: {
        type: 'function',
        className: 'Function',
        description: 'Array(1)',
        objectId: '{"injectedScriptId":1,"id":64}'
      },
      writable: true,
      configurable: true,
      enumerable: true,
      isOwn: true
    },
    function2: {
      name: 'asyncFunc',
      value: {
        type: 'function',
        className: 'AsyncFunction',
        objectId: '{"injectedScriptId":1,"id":32}'
      },
      writable: true,
      configurable: true,
      enumerable: true,
      isOwn: true
    },
    null1: {
      name: 'parent',
      value: {
        subtype: 'null',
        type: 'object',
        value: null
      },
      configurable: true,
      writable: true,
      enumerable: true,
      isOwn: true
    }
  }
}

module.exports = localsFixtures;
