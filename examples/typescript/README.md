# TypeScript Example

This example shows how to use rollbar.js with TypeScript. The example demonstrates how to:

- Import Rollbar in a TypeScript file
- Configure a Rollbar instance
- Use TypeScript interfaces with Rollbar
- Log messages and data with strong typing

## Requirements

- Node.js v18+
- npm or yarn

## Running the example

```bash
# Install dependencies
npm install

# Build the TypeScript files
npm run build

# Run the example
npm start
```

## How it works

The project includes:

1. TypeScript configuration in `tsconfig.json`
2. Dependencies for TypeScript in `package.json`
3. Example TypeScript code in `src/example.ts`

This example works because the rollbar.js library includes TypeScript definitions in `index.d.ts` and the build system has been configured to support TypeScript files.