import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { Provider, ErrorBoundary, useRollbar } from "@rollbar/react";
import Rollbar from "rollbar";
import styles from "@/styles/Home.module.css";

// Rollbar configuration using built-in types
const rollbarConfig: Rollbar.Configuration = {
  accessToken: 'YOUR_CLIENT_ACCESS_TOKEN', // Replace with your actual token
  environment: 'development',
  captureUncaught: true,
  captureUnhandledRejections: true,
  payload: {
    client: {
      javascript: {
        source_map_enabled: true,
        code_version: '1.0.0',
      }
    },
    person: {
      id: 'user123',
      email: 'user@example.com',
      username: 'testuser',
    }
  }
};

// Create Rollbar instance
const rollbar = new Rollbar(rollbarConfig);

// Component that might throw an error
interface ErrorProneComponentProps {
  shouldError: boolean;
}

function ErrorProneComponent({ shouldError }: ErrorProneComponentProps) {
  if (shouldError) {
    throw new Error('React component error for Rollbar testing');
  }
  return <p className={styles.successMessage}>Component rendered successfully!</p>;
}

// Custom error metadata interface
interface ErrorMetadata {
  timestamp: string;
  action: string;
  page?: string;
  [key: string]: unknown;
}

export default function App() {
  return (
    <Provider instance={rollbar}>
      <ErrorBoundary>
        <Home />
      </ErrorBoundary>
    </Provider>
  );
}

function Home() {
  const rollbar = useRollbar();
  const [showError, setShowError] = useState<boolean>(false);

  // Function to trigger a manually reported error
  const triggerManualError = (): void => {
    try {
      throw new Error('Manually triggered error for Rollbar testing');
    } catch (error) {
      if (error instanceof Error) {
        rollbar.error('Manual error caught and reported', error);
      }
      alert('Error reported to Rollbar!');
    }
  };

  // Function to trigger an uncaught error
  const triggerUncaughtError = (): void => {
    const nullObject = null as any;
    nullObject.nonExistentMethod();
  };

  // Function to trigger a promise rejection
  const triggerPromiseRejection = (): void => {
    new Promise<void>((_, reject) => {
      reject(new Error('Promise rejection for Rollbar testing'));
    });
    alert('Promise rejection triggered!');
  };

  // Function to log custom messages with typed metadata
  const logCustomMessage = (): void => {
    const metadata: ErrorMetadata = {
      timestamp: new Date().toISOString(),
      action: 'button_click',
      page: 'home',
    };

    rollbar.info('Custom info message from Next.js TypeScript app');
    rollbar.log('User clicked the custom message button', metadata);
    alert('Custom message logged to Rollbar!');
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Rollbar Next.js TypeScript Example</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Rollbar + <Link href="https://nextjs.org">Next.js</Link> TypeScript
        </h1>

        <p className={styles.description}>
          Demonstrate error tracking with Rollbar in Next.js using TypeScript
        </p>

        <div className={styles.errorButtons}>
          <h2>Error Testing</h2>
          <div className={styles.buttonGrid}>
            <button
              onClick={triggerManualError}
              className={styles.errorButton}
              type="button"
            >
              Trigger Manual Error
            </button>
            <button
              onClick={triggerUncaughtError}
              className={`${styles.errorButton} ${styles.danger}`}
              type="button"
            >
              Trigger Uncaught Error
            </button>
            <button
              onClick={triggerPromiseRejection}
              className={styles.errorButton}
              type="button"
            >
              Trigger Promise Rejection
            </button>
            <button
              onClick={() => setShowError(!showError)}
              className={styles.errorButton}
              type="button"
            >
              Toggle Component Error
            </button>
            <button
              onClick={logCustomMessage}
              className={`${styles.errorButton} ${styles.info}`}
              type="button"
            >
              Log Custom Message
            </button>
          </div>
        </div>

        <div className={styles.status}>
          <ErrorProneComponent shouldError={showError} />
        </div>

        <div className={styles.instructions}>
          <h3>Setup Instructions:</h3>
          <ol>
            <li>Replace 'YOUR_CLIENT_ACCESS_TOKEN' with your Rollbar project token</li>
            <li>Run <code>npm install</code> to install dependencies</li>
            <li>Run <code>npm run dev</code> to start the development server</li>
            <li>Click the buttons to trigger different types of errors</li>
            <li>Check your Rollbar dashboard to see the reported errors</li>
          </ol>
        </div>

        <div className={styles.typeScriptFeatures}>
          <h3>TypeScript Benefits:</h3>
          <ul>
            <li>Type-safe Rollbar configuration with <code>Rollbar.Configuration</code></li>
            <li>Proper error type checking with <code>instanceof Error</code></li>
            <li>Typed component props and state management</li>
            <li>IntelliSense support for Rollbar methods</li>
            <li>Compile-time error checking</li>
          </ul>
        </div>

        <div className={styles.grid}>
          <a href="https://nextjs.org/docs" className={styles.card}>
            <h3>Documentation &rarr;</h3>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>

          <a href="https://docs.rollbar.com/" className={styles.card}>
            <h3>Rollbar Docs &rarr;</h3>
            <p>Learn about Rollbar error tracking and monitoring.</p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/canary/examples"
            className={styles.card}
          >
            <h3>Examples &rarr;</h3>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a
            href="https://www.typescriptlang.org/docs/"
            className={styles.card}
          >
            <h3>TypeScript &rarr;</h3>
            <p>Learn about TypeScript features and best practices.</p>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <img src="/vercel.svg" alt="Vercel" className={styles.logo} />
        </a>
      </footer>
    </div>
  );
}
