# Rollbar Next.js TypeScript Example

This example demonstrates how to integrate Rollbar error monitoring into a Next.js application using TypeScript, showcasing type-safe error tracking and reporting.

## Features

- ✅ Next.js with TypeScript configuration
- ✅ Rollbar error tracking with full type support
- ✅ Type-safe Rollbar configuration using `Rollbar.Configuration`
- ✅ Error Boundary with proper TypeScript types
- ✅ Manual error reporting with type checking
- ✅ Uncaught error and promise rejection tracking
- ✅ Custom typed metadata for error context
- ✅ IntelliSense support for all Rollbar methods

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

   Note: Use npm (not yarn) to ensure the local Rollbar package symlink works correctly.

2. **Configure Rollbar:**
   - Open `pages/index.tsx`
   - Replace `'YOUR_CLIENT_ACCESS_TOKEN'` with your actual Rollbar project access token
   - You can get your access token from your Rollbar project settings

3. **Run the development server:**
   ```bash
   npm run dev
   ```

   The app will start on http://localhost:3002

## TypeScript Benefits Demonstrated

### 1. **Type-Safe Configuration**
```typescript
const rollbarConfig: Rollbar.Configuration = {
  accessToken: 'YOUR_TOKEN',
  environment: 'development',
  // TypeScript ensures all options are valid
};
```

### 2. **Proper Error Type Checking**
```typescript
try {
  throw new Error('Something went wrong');
} catch (error) {
  if (error instanceof Error) {
    rollbar.error('Error caught', error);
  }
}
```

### 3. **Typed Component Props**
```typescript
interface ErrorProneComponentProps {
  shouldError: boolean;
}

function ErrorProneComponent({ shouldError }: ErrorProneComponentProps) {
  // Component implementation
}
```

### 4. **Custom Typed Metadata**
```typescript
interface ErrorMetadata {
  timestamp: string;
  action: string;
  page?: string;
  [key: string]: unknown;
}

const metadata: ErrorMetadata = {
  timestamp: new Date().toISOString(),
  action: 'button_click',
  page: 'home',
};
```

## Interactive Demo Features

The example provides interactive buttons to test different error scenarios:

### 1. **Trigger Manual Error**
- Demonstrates type-safe error catching and reporting
- Uses `instanceof Error` type guard for proper error handling

### 2. **Trigger Uncaught Error**
- Shows how Rollbar captures runtime errors automatically
- TypeScript helps prevent many of these errors at compile time

### 3. **Trigger Promise Rejection**
- Demonstrates typed Promise error handling
- Shows automatic capture of unhandled rejections

### 4. **Toggle Component Error**
- Tests Error Boundary with typed component props
- Shows React component error tracking

### 5. **Log Custom Message**
- Demonstrates logging with typed metadata
- Shows IntelliSense support for Rollbar methods

## Key TypeScript Integration Points

### Type Imports
```typescript
import Rollbar from "rollbar";
// Rollbar.Configuration type is automatically available
```

### React Hooks with Types
```typescript
const rollbar = useRollbar();
// rollbar is properly typed with all available methods
```

### Async Error Handling
```typescript
const fetchData = async (): Promise<void> => {
  try {
    const response = await fetch('/api/data');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    rollbar.error('Fetch failed', error as Error);
  }
};
```

## Building for Production

```bash
npm run build
npm run start
```

TypeScript compilation is handled automatically during the build process. Any type errors will prevent the build from completing.

## Type Checking

Run TypeScript compiler to check for type errors without building:

```bash
npx tsc --noEmit
```

## Project Structure

```
├── pages/
│   ├── index.tsx         # Main page with typed Rollbar integration
│   ├── _app.tsx          # Next.js app component
│   └── api/
│       └── hello.ts      # Example API route with types
├── styles/
│   ├── Home.module.css   # Component styles
│   └── globals.css       # Global styles
├── tsconfig.json         # TypeScript configuration
├── next.config.ts        # Next.js configuration
└── package.json          # Dependencies and scripts
```

## Learn More

- [Rollbar Documentation](https://docs.rollbar.com/)
- [Rollbar TypeScript Types](https://github.com/rollbar/rollbar.js/blob/master/index.d.ts)
- [Next.js TypeScript Documentation](https://nextjs.org/docs/basic-features/typescript)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
